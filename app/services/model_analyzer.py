import os

import numpy as np
import tensorflow as tf
from PIL import Image, ImageDraw, ImageFont

# Define the path to the model
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "weights", "best-fp16.tflite")

# Class names for the YOLO model
CLASS_NAMES = [
    "car_back",
    "car_side",
    "car_front",
    "bus_back",
    "bus_side",
    "bus_front",
    "truck_back",
    "truck_side",
    "truck_front",
    "motorcycle_back",
    "motorcycle_side",
    "motorcycle_front",
    "bicycle_back",
    "bicycle_side",
    "bicycle_front",
]

# Load the TFLite model and allocate tensors once globally
try:
    _interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
    _interpreter.allocate_tensors()
    _input_details = _interpreter.get_input_details()
    _output_details = _interpreter.get_output_details()
    _INPUT_HEIGHT = _input_details[0]["shape"][1]
    _INPUT_WIDTH = _input_details[0]["shape"][2]
except Exception as e:
    print(f"Error loading TFLite model globally: {e}")
    print(
        "Please ensure you have the TensorFlow Lite runtime installed and model path is correct."
    )
    _interpreter = None
    _input_details = None
    _output_details = None
    _INPUT_HEIGHT = 640  # Default fallback
    _INPUT_WIDTH = 640  # Default fallback

# Define thresholds for post-processing
CONF_THRESHOLD = 0.25
IOU_THRESHOLD = 0.45
MAX_OUTPUT_SIZE_PER_CLASS = 50


def analyze_and_draw(image_path: str, output_image_dir: str = "output_images") -> tuple:
    """
    Performs object detection on an image using a TFLite model, draws bounding boxes,
    labels, and confidence scores, saves the annotated image, and returns detection data.

    Args:
        image_path (str): The path to the input image file.
        output_image_dir (str): Directory to save the output annotated image.

    Returns:
        tuple: A tuple containing:
            - vehicle_counter (int): Number of vehicles detected.
            - image_size (tuple): Original dimensions of the image (width, height).
            - vehicle_data (list): List of detected vehicles, each as:
                                   [class_name, confidence_score, [normalized xmin, ymin, xmax, ymax]]
            - output_image_path (str): The path where the annotated image is saved.
    """
    if _interpreter is None:
        print("Model not loaded. Cannot run inference.")
        return 0, (0, 0), [], ""

    print(f"\n--- Running Analysis and Drawing on: {image_path} ---")

    # Ensure output directory exists
    os.makedirs(output_image_dir, exist_ok=True)
    output_image_name = f"annotated_{os.path.basename(image_path)}"
    output_image_path = os.path.join(output_image_dir, output_image_name)

    vehicle_counter = 0
    vehicle_data = []

    # Load the original image for drawing later
    try:
        original_img = Image.open(image_path).convert("RGB")
        original_img_width, original_img_height = original_img.size
        image_size = (original_img_width, original_img_height)
    except FileNotFoundError:
        print(f"Error: Image file not found at {image_path}")
        return 0, (0, 0), [], ""
    except Exception as e:
        print(f"Error loading original image: {e}")
        return 0, (0, 0), [], ""

    # Preprocess the image for model inference
    img_resized = original_img.resize((_INPUT_WIDTH, _INPUT_HEIGHT))
    input_data = np.array(img_resized, dtype=np.float32)
    input_data = input_data / 255.0  # Normalize to [0, 1]

    # Add a batch dimension
    input_data = np.expand_dims(input_data, axis=0)

    # Check data type
    if input_data.dtype != _input_details[0]["dtype"]:
        print(
            f"Warning: Input data type {input_data.dtype} does not match model's expected type {_input_details[0]['dtype']}."
            " Attempting to cast..."
        )
        input_data = input_data.astype(_input_details[0]["dtype"])

    # Set the value of the input tensor and run inference
    _interpreter.set_tensor(_input_details[0]["index"], input_data)
    _interpreter.invoke()

    # Get the results and remove the batch dimension
    output_data = _interpreter.get_tensor(_output_details[0]["index"])[0]

    # Extract bounding boxes, objectness scores, and class scores
    boxes = output_data[:, :4]
    objectness_scores = output_data[:, 4]
    class_scores = output_data[:, 5:]
    combined_scores = objectness_scores[:, np.newaxis] * class_scores

    # Filter by confidence
    max_scores_per_box = np.max(combined_scores, axis=1)
    high_conf_mask = max_scores_per_box > CONF_THRESHOLD

    boxes_filtered = boxes[high_conf_mask]
    combined_scores_filtered = combined_scores[high_conf_mask]

    if boxes_filtered.shape[0] == 0:
        print("No objects detected with confidence above the threshold.")
        original_img.save(output_image_path)  # Save original image if no detections
        print(
            f"Output image (no detections) saved to {os.path.abspath(output_image_path)}"
        )
        print("--- Inference Complete ---")
        return 0, image_size, [], os.path.abspath(output_image_path)

    # Convert boxes from [x_center, y_center, width, height] to [y1, x1, y2, x2] for NMS
    x_center, y_center, width, height = (
        boxes_filtered[:, 0],
        boxes_filtered[:, 1],
        boxes_filtered[:, 2],
        boxes_filtered[:, 3],
    )
    y1 = np.clip(y_center - height / 2, 0, 1)
    x1 = np.clip(x_center - width / 2, 0, 1)
    y2 = np.clip(y_center + height / 2, 0, 1)
    x2 = np.clip(x_center + width / 2, 0, 1)
    boxes_for_nms = np.stack([y1, x1, y2, x2], axis=-1)

    final_boxes = []
    final_scores = []
    final_class_ids = []

    # Apply Non-Max Suppression (NMS) per class
    for class_id in range(len(CLASS_NAMES)):
        class_specific_scores = combined_scores_filtered[:, class_id]
        selected_indices = tf.image.non_max_suppression(
            boxes=boxes_for_nms,
            scores=class_specific_scores,
            max_output_size=MAX_OUTPUT_SIZE_PER_CLASS,
            iou_threshold=IOU_THRESHOLD,
            score_threshold=CONF_THRESHOLD,
        )

        if selected_indices.numpy().size > 0:
            selected_boxes = tf.gather(boxes_for_nms, selected_indices).numpy()
            selected_scores = tf.gather(class_specific_scores, selected_indices).numpy()
            selected_class_ids = np.full(selected_scores.shape, class_id)

            final_boxes.extend(selected_boxes)
            final_scores.extend(selected_scores)
            final_class_ids.extend(selected_class_ids)

    if not final_boxes:
        print("No objects detected after Non-Max Suppression.")
        original_img.save(output_image_path)
        print(
            f"Output image (no detections) saved to {os.path.abspath(output_image_path)}"
        )
        print("--- Inference Complete ---")
        return 0, image_size, [], os.path.abspath(output_image_path)

    # Sort results by score in descending order
    sorted_indices = np.argsort(final_scores)[::-1]

    # Prepare data for return
    for i in sorted_indices:
        box = final_boxes[i]
        score = final_scores[i]
        class_id = int(final_class_ids[i])
        class_name = CLASS_NAMES[class_id]
        vehicle_data.append([class_name, float(f"{score:.2f}"), box.tolist()])
        vehicle_counter += 1

    # Draw bounding boxes on the original image
    draw = ImageDraw.Draw(original_img)
    try:
        font = ImageFont.truetype("arial.ttf", 40)
    except IOError:
        print(
            "Warning: 'arial.ttf' not found. Falling back to default font. "
            "Font scaling may not work as expected. Please install ttf-arial."
        )
        font = ImageFont.load_default()

    for i in sorted_indices:
        box = final_boxes[i]
        score = final_scores[i]
        class_id = int(final_class_ids[i])

        # Unpack normalized box coordinates
        y1, x1, y2, x2 = box

        # Scale to original image dimensions
        x1_pixel, y1_pixel, x2_pixel, y2_pixel = (
            int(x1 * original_img_width),
            int(y1 * original_img_height),
            int(x2 * original_img_width),
            int(y2 * original_img_height),
        )

        # Draw rectangle
        draw.rectangle([x1_pixel, y1_pixel, x2_pixel, y2_pixel], outline="red", width=3)

        # Draw label and confidence
        label = f"{CLASS_NAMES[class_id]}: {score:.2f}"

        _, _, text_width, text_height = font.getbbox(label)

        # Calculate text background position with padding
        padding = 4
        text_bg_x1 = x1_pixel
        text_bg_y1 = max(0, y1_pixel - text_height - padding * 2)
        text_bg_x2 = x1_pixel + text_width + padding * 2
        text_bg_y2 = y1_pixel - padding

        # Draw filled rectangle for text background (matching bounding box color)
        draw.rectangle([text_bg_x1, text_bg_y1, text_bg_x2, text_bg_y2], fill="red")

        # Position text on top of the background
        text_x = x1_pixel + padding
        text_y = max(0, y1_pixel - text_height - padding)

        # Draw text in white for better contrast
        draw.text((text_x, text_y), label, fill="white", font=font)

    # Save the image with bounding boxes
    original_img.show();
    print(
        f"\nOutput image with detections saved to {os.path.abspath(output_image_path)}"
    )

    print("\n--- Inference Complete ---")
    return vehicle_counter, image_size, vehicle_data, os.path.abspath(output_image_path)


if __name__ == "__main__":
    # Example usage:
    # Set IMAGE_PATH in a real scenario, this would be passed to the function
    sample_image_path = "sample.jpeg"
    output_dir = "insurance_claim/output_images"  # You can change this directory

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
