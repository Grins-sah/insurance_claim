import cv2
import pytesseract
import re
import json
import requests
import os
import platform
from PIL import Image
from datetime import datetime

# Configure Tesseract path for Windows
if platform.system() == "Windows":
    # Check common installation paths
    possible_paths = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        os.getenv("TESSERACT_CMD", ""),
        # Check if user somehow has it in venv (unlikely but possible if manual)
        os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".venv", "Scripts", "tesseract.exe")
    ]
    
    for path in possible_paths:
        if path and os.path.exists(path):
            pytesseract.pytesseract.tesseract_cmd = path
            break

OLLAMA_MODEL = "mistral:latest"
OLLAMA_URL = "http://localhost:11434/api/generate"

TESSERACT_CONFIG = "--oem 1 --psm 6 -l eng"

def preprocess_image(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 9, 75, 75)
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return thresh

def extract_text(image_path):
    img = preprocess_image(image_path)
    text = pytesseract.image_to_string(img, config=TESSERACT_CONFIG)
    return text.strip()

def extract_text_two_sides(front_image, back_image):
    front_text = extract_text(front_image)
    back_text = extract_text(back_image)

    combined_text = f"""
    --- RC FRONT SIDE ---
    {front_text}

    --- RC BACK SIDE ---
    {back_text}
    """
    print(combined_text.strip())
    return combined_text.strip()

RC_KEYWORDS = [
    "regn. number",
    "date of regn.",
    "regn. validity",
    "registration certificate",
    "chassis",
    "engine",
    "model name",
    "maker's name",
    "colour"
]

def looks_like_rc(text):
    text_l = text.lower()
    hits = sum(1 for k in RC_KEYWORDS if k in text_l)
    return hits >= 2

def call_llm(ocr_text):
    prompt = f"""
        You are a strict document parser for Indian Vehicle Registration Certificates (RC).

        Rules:
        - Use ONLY the given OCR text
        - Do NOT guess or infer
        - If unsure, use null
        - Return ONLY valid JSON
        - If not an RC, return {{ "is_rc": false }}

        If RC, return:
        {{
          "is_rc": true,
          "rc_details": {{
            "owner_name": null,
            "regn_number": null,
            "chassis_number": null,
            "engine_number": null,
            "vehicle_class": null,
            "fuel_type": null,
            "date_of_regn": null,
            "regn_validity": null,
            "registration_authority": null,
            "maker_name": null,
            "model_name": null,
            "colour": null,
            "address": null
          }}
        }}

        OCR TEXT:
        <<<
        {ocr_text}
        >>>
    """

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False
        },
        timeout=60
    )

    output = response.json()["response"]
    return output

VEHICLE_REGEX = re.compile(r"^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$")
CHASSIS_REGEX = re.compile(r"^[A-HJ-NPR-Z0-9]{17}$")

def validate_rc(data):
    if not data.get("is_rc"):
        return data

    rc = data.get("rc_details", {})

    if rc.get("vehicle_number"):
        rc["vehicle_number"] = rc["vehicle_number"].replace(" ", "")
        if not VEHICLE_REGEX.match(rc["vehicle_number"]):
            return {"is_rc": False}

    if rc.get("chassis_number"):
        if not CHASSIS_REGEX.match(rc["chassis_number"]):
            rc["chassis_number"] = None

    if rc.get("registration_date"):
        try:
            datetime.strptime(rc["registration_date"], "%Y-%m-%d")
        except:
            rc["registration_date"] = None

    data["rc_details"] = rc
    return data

def process_document(front_image, back_image):
    ocr_text = extract_text_two_sides(front_image, back_image)

    if not looks_like_rc(ocr_text):
        return {"is_rc": False}

    llm_output = call_llm(ocr_text)

    try:
        parsed = json.loads(llm_output)
    except json.JSONDecodeError:
        return {"is_rc": False, "error": "Invalid LLM JSON"}

    return validate_rc(parsed)

if __name__ == "__main__":
    import sys

    if len(sys.argv) != 3:
        print("Usage: python rc_detector.py <image_path_front> <image_path_back>")
        sys.exit(1)

    result = process_document(sys.argv[1], sys.argv[2])
    print(json.dumps(result, indent=2))
