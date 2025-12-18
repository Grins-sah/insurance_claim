import cv2
import pytesseract
import re
import json
from datetime import datetime
from app.services.hf_query import QueryHuggingFace

hf_query = QueryHuggingFace()

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

PRESCRIPTION_KEYWORDS = [
    "doctor",
    "dr.",
    "patient",
    "diagnosis",
    "rx",
    "medicine",
    "dosage",
    "signature",
    "clinic",
    "hospital",
    "advice",
    "tablet",
    "capsule",
    "syrup"
]

def looks_like_prescription(text):
    text_l = text.lower()
    hits = sum(1 for k in PRESCRIPTION_KEYWORDS if k in text_l)
    return hits >= 2

def call_llm(ocr_text):
    prompt = f"""
        You are a strict document parser for Doctor Prescriptions.

        Rules:
        - Use ONLY the given OCR text
        - Do NOT guess or infer
        - If unsure, use null
        - Return ONLY valid JSON
        - If not a Prescription, return {{ "is_prescription": false }}

        If Prescription, return:
        {{
          "is_prescription": true,
          "prescription_details": {{
            "doctor_name": null,
            "hospital_clinic_name": null,
            "patient_name": null,
            "date": null,
            "diagnosis": null,
            "medicines": [],
            "advice": null
          }}
        }}
        
        For "medicines", return a list of objects with "name", "dosage", "frequency" if available, or just strings.

        OCR TEXT:
        <<<
        {ocr_text}
        >>>
    """

    output = hf_query.query(prompt)
    return output

def process_prescription(image_path):
    ocr_text = extract_text(image_path)

    if not looks_like_prescription(ocr_text):
        return {"is_prescription": False}

    llm_output = call_llm(ocr_text)

    try:
        parsed = json.loads(llm_output)
    except json.JSONDecodeError:
        # Try to find JSON in the output if it contains extra text
        try:
            match = re.search(r'\{.*\}', llm_output, re.DOTALL)
            if match:
                parsed = json.loads(match.group(0))
            else:
                return {"is_prescription": False, "error": "Invalid LLM JSON"}
        except:
             return {"is_prescription": False, "error": "Invalid LLM JSON"}

    return parsed

if __name__ == "__main__":
    import sys

    if len(sys.argv) != 2:
        print("Usage: python prescription_detector.py <image_path>")
        sys.exit(1)

    result = process_prescription(sys.argv[1])
    print(json.dumps(result, indent=2))
