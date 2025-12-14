from fastapi import FastAPI
from app.routes.detect_vehicle import detect
app = FastAPI()
from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.database import db
from fastapi.middleware.cors import CORSMiddleware
from app.services.model_analyzer import analyze_and_draw
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/detect_vehicle")
def detect_vehicle_endpoint():
    vehicle_counter, image_size, vehicle_data = detect(r"A:\insurance_claim_project\sample.jpeg")
    return {
        "vehicle_counter": vehicle_counter,
        "image_size": image_size,
        "vehicle_data": vehicle_data
    }
@app.get("/orientation_detection")
def orientation_detection_endpoint():
    vehicle_count, img_dims, detections, annotated_img_path = analyze_and_draw(
        r"A:\insurance_claim_project\sample.jpeg", "output_images"
    )
    return {
        "vehicle_count": vehicle_count,
        "image_dimensions": img_dims,
        "detections": detections,
        "annotated_image_path": annotated_img_path
    }


def serialize_doc(doc):
    if doc:
        doc['_id'] = str(doc['_id'])
    return doc

@app.get("/uploads/{object_id}")
async def get_upload_data(object_id: str):
    try:
        oid = ObjectId(object_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")
    document = db.uploads.find_one({"_id": oid}) 
    if not document:
        raise HTTPException(status_code=404, detail="File data not found")
    return serialize_doc(document)
# pending endpoints for insurance claim processing and report generation

# 1. document upload endpoint (vedant) ,rc book , chassis number
# 2. claim processing endpoint         (anush , ayush)
# 3. annomaly detection endpoint 
# 4. report generation endpoint git (anush , ayush)
