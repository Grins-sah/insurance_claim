from fastapi import FastAPI
from app.routes.detect_vehicle import detect
app = FastAPI()
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
# pending endpoints for insurance claim processing and report generation

# 1. document upload endpoint
# 2. claim processing endpoint
# 3. annomaly detection endpoint
# 4. report generation endpointgit
