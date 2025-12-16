from fastapi import APIRouter, HTTPException, UploadFile, File
from app.routes.detect_vehicle import detect
from app.services.model_analyzer import analyze_and_draw
from app.services.vehicle_anomaly_service import vehicle_anomaly_service
import shutil
import os

router = APIRouter()

@router.get("/detect_vehicle")
def detect_vehicle_endpoint():
    # TODO: This path should probably be dynamic or uploaded file
    vehicle_counter, image_size, vehicle_data = detect(r"A:\insurance_claim_project\sample.jpeg")
    return {
        "vehicle_counter": vehicle_counter,
        "image_size": image_size,
        "vehicle_data": vehicle_data
    }

@router.get("/orientation_detection")
def orientation_detection_endpoint():
    # TODO: This path should probably be dynamic or uploaded file
    vehicle_count, img_dims, detections, annotated_img_path = analyze_and_draw(
        r"A:\insurance_claim_project\sample.jpeg", "output_images"
    )
    return {
        "vehicle_count": vehicle_count,
        "image_dimensions": img_dims,
        "detections": detections,
        "annotated_image_path": annotated_img_path
    }

# Placeholder for future vehicle claim processing
@router.post("/process_vehicle_claim")
def process_vehicle_claim():
    return {"message": "Vehicle claim processing pipeline initiated (Pending Implementation)"}

@router.post("/vehicle/anomaly-detection")
def detect_vehicle_anomalies(file: UploadFile = File(...)):
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    results = vehicle_anomaly_service.detect_anomalies(file_path)

    os.remove(file_path)

    return {"detections": results}
