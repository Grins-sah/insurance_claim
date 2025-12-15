from fastapi import APIRouter, HTTPException
from app.routes.detect_vehicle import detect
from app.services.model_analyzer import analyze_and_draw

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
