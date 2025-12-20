from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from bson import ObjectId
from app.database import db
from app.services.health_service import HealthClaimService
from app.services.medical_bill_detector import process_medical_bill
from app.services.prescription_detector import process_prescription
import shutil
import os

router = APIRouter()

class ClaimRequest(BaseModel):
    object_ids: List[str]
    query: str
    medical_bill_data: Optional[Dict[str, Any]] = None
    prescription_data: Optional[Dict[str, Any]] = None

class DocumentRequest(BaseModel):
    object_id: str

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

@router.post("/process_medical_bill")
async def process_medical_bill_endpoint(request: DocumentRequest):
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    
    file_path = None
    try:
        file_path = get_file_from_db(request.object_id, temp_dir)
        result = process_medical_bill(file_path)
        return result
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)

@router.post("/process_prescription")
async def process_prescription_endpoint(request: DocumentRequest):
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    
    file_path = None
    try:
        file_path = get_file_from_db(request.object_id, temp_dir)
        result = process_prescription(file_path)
        return result
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)


@router.post("/validate_claim")
async def validate_claim_endpoint(request: ClaimRequest):
    if not request.object_ids:
        raise HTTPException(status_code=400, detail="object_ids list cannot be empty")
    
    if not request.query:
        raise HTTPException(status_code=400, detail="query cannot be empty")

    try:
        validator = HealthClaimService()
        analysis = validator.validate_claim(
            query=request.query, 
            object_ids=request.object_ids,
            medical_bill_data=request.medical_bill_data,
            prescription_data=request.prescription_data
        )
        
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
