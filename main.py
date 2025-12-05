# fastapi pending
import os

from model_analyzer import analyze_and_draw

if __name__ == "__main__":
    sample_image_path = "sample.jpeg"
    output_dir = "insurance_claim/output_images"

    print(f"Analyzing image: {sample_image_path}")
    vehicle_count, img_dims, detections, annotated_img_path = analyze_and_draw(
        sample_image_path, output_dir
    )

    print("\n--- Summary of Detections ---")
    print(f"Total vehicles detected: {vehicle_count}")
    print(f"Original Image Dimensions: {img_dims[0]}x{img_dims[1]}")
    for det in detections:
        class_name, confidence, bbox = det
        print(
            f"  - Class: {class_name}, Confidence: {confidence:.2f}, BBox (normalized): {bbox}"
        )
    print(f"Annotated image saved to: {annotated_img_path}")
