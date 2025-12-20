from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from bson import ObjectId
from app.database import db
from app.routes.detect_vehicle import detect
from app.services.model_analyzer import analyze_and_draw
from app.services.vehicle_anamoly_service import VehicleAnomalyService
from app.services.hf_query import QueryHuggingFace
from app.services.prompts import VEHICLE_CLAIM_PROMPT
from app.services.RAG_init import model as embedding_model, pinecone_api_key
from pinecone import Pinecone
import os

router = APIRouter()

class DocumentRequest(BaseModel):
    object_id: str

class ClaimWorkflowRequest(BaseModel):
    image_ids: List[str]
    policy_id: str
    user_description: str = "No description provided"

def get_file_from_db(object_id: str, temp_dir: str) -> str:
    try:
        oid = ObjectId(object_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")

    document = db.uploads.find_one({"_id": oid})
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    raw_data = document.get('data')
    if not raw_data:
        raise HTTPException(status_code=404, detail="Document has no data")

    # Handle binary data
    if not isinstance(raw_data, bytes) and hasattr(raw_data, '__bytes__'):
        raw_data = bytes(raw_data)
    
    filename = document.get('filename', f"{object_id}.jpg") # Default to jpg if no filename
    file_path = os.path.join(temp_dir, filename)

    with open(file_path, "wb") as f:
        f.write(raw_data)
    
    return file_path

@router.post("/detect_vehicle")
def detect_vehicle_endpoint(request: DocumentRequest):
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = None
    
    try:
        file_path = get_file_from_db(request.object_id, temp_dir)
        vehicle_counter, image_size, vehicle_data = detect(file_path)
        return {
            "vehicle_counter": vehicle_counter,
            "image_size": image_size,
            "vehicle_data": vehicle_data
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)

@router.post("/orientation_detection")
def orientation_detection_endpoint(request: DocumentRequest):
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = None
    
    try:
        file_path = get_file_from_db(request.object_id, temp_dir)
        # Output directory for annotated images
        output_dir = "output_images"
        os.makedirs(output_dir, exist_ok=True)
        
        vehicle_count, img_dims, detections, annotated_img_path = analyze_and_draw(
            file_path, output_dir
        )
        return {
            "vehicle_count": vehicle_count,
            "image_dimensions": img_dims,
            "detections": detections,
            "annotated_image_path": annotated_img_path
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)

# Placeholder for future vehicle claim processing
@router.post("/process_vehicle_claim")
def process_vehicle_claim():
    return {"message": "Vehicle claim processing pipeline initiated (Pending Implementation)"}

@router.post("/vehicle/anomaly-detection")
def detect_vehicle_anomalies(request: DocumentRequest):
    vehicle_anomaly_service = VehicleAnomalyService(device='cuda')
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = None
    
    try:
        file_path = get_file_from_db(request.object_id, temp_dir)
        results = vehicle_anomaly_service.detect_anomalies(file_path)
        return {"result": results}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)

@router.post("/process_claim_workflow")
def process_claim_workflow(request: ClaimWorkflowRequest):
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    file_paths = []
    
    try:
        # 1. Initialize Services
        vehicle_anomaly_service = VehicleAnomalyService(device='cuda')
        hf_query = QueryHuggingFace()
        pc = Pinecone(api_key=pinecone_api_key)
        index = pc.Index("insurance-claims") # Assuming index name

        aggregated_vehicle_data = []
        aggregated_anomalies = []

        # 2. Process Each Image
        for img_id in request.image_ids:
            file_path = get_file_from_db(img_id, temp_dir)
            file_paths.append(file_path)

            # A. Vehicle Detection (Orientation/Type)
            # Using analyze_and_draw() from model_analyzer.py for orientation
            v_count, img_size, v_data, _ = analyze_and_draw(file_path, temp_dir)
            
            # B. Anomaly Detection
            anomaly_result = vehicle_anomaly_service.detect_anomalies(file_path)

            aggregated_vehicle_data.append({
                "image_id": img_id,
                "vehicle_count": v_count,
                "detections": v_data
            })
            aggregated_anomalies.append({
                "image_id": img_id,
                "anomaly": anomaly_result
            })

        # 3. Retrieve Policy Context (RAG)
        # We query based on the detected anomalies to find relevant clauses
        query_text = "vehicle damage coverage " + " ".join([a['anomaly']['predicted_class'] for a in aggregated_anomalies])
        query_embedding = embedding_model.encode(query_text).tolist()
        
        # Query Pinecone
        # Filter by policy_id if metadata contains it, otherwise just semantic search
        # Assuming policy documents are indexed. 
        # If we want to restrict to the specific policy uploaded, we might need metadata filtering.
        # For now, we'll do a general semantic search or assume the policy_id refers to the doc to be used.
        # If policy_id is the doc ID, we might want to fetch THAT doc's text directly if it's not indexed yet?
        # But the prompt says "Retrieved from Knowledge Base". Let's assume it's indexed.
        
        search_results = index.query(
            vector=query_embedding,
            top_k=3,
            include_metadata=True,
            filter={"source_id": request.policy_id}
        )
        
        context_text = "\n".join([match['metadata']['text'] for match in search_results['matches'] if 'text' in match['metadata']])

        # 4. Generate Report with LLM
        vehicle_details_str = str(aggregated_vehicle_data)
        anomalies_str = str(aggregated_anomalies)

        prompt = VEHICLE_CLAIM_PROMPT.format(
            context=context_text,
            vehicle_details=vehicle_details_str,
            anomalies=anomalies_str,
            user_description=request.user_description
        )

        report = hf_query.query(prompt)

        return {
            "status": "success",
            "vehicle_analysis": aggregated_vehicle_data,
            "anomaly_analysis": aggregated_anomalies,
            "claim_report": report
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        for fp in file_paths:
            if os.path.exists(fp):
                os.remove(fp)

