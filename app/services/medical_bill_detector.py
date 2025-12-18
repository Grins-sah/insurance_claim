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

BILL_KEYWORDS = [
    "invoice",
    "bill",
    "total",
    "amount",
    "hospital",
    "patient",
    "date",
    "gst",
    "receipt",
    "charges",
    "description"
]

def looks_like_bill(text):
    text_l = text.lower()
    hits = sum(1 for k in BILL_KEYWORDS if k in text_l)
    return hits >= 2

def call_llm(ocr_text):
    prompt = f"""
        You are a strict document parser for Medical Bills/Invoices.

        Rules:
        - Use ONLY the given OCR text
        - Do NOT guess or infer
        - If unsure, use null
        - Return ONLY valid JSON
        - If not a Medical Bill, return {{ "is_medical_bill": false }}

        If Medical Bill, return:
        {{
          "is_medical_bill": true,
          "bill_details": {{
            "hospital_name": null,
            "patient_name": null,
            "bill_number": null,
            "bill_date": null,
            "total_amount": null,
            "gst_number": null,
            "items": [] 
          }}
        }}
        
        For "items", return a list of strings or objects describing the services/medicines charged if available.

        OCR TEXT:
        <<<
        {ocr_text}
        >>>
    """

    output = hf_query.query(prompt)
    return output

def process_medical_bill(image_path):
    ocr_text = extract_text(image_path)

    if not looks_like_bill(ocr_text):
        return {"is_medical_bill": False}

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
                return {"is_medical_bill": False, "error": "Invalid LLM JSON"}
        except:
             return {"is_medical_bill": False, "error": "Invalid LLM JSON"}

    return parsed

if __name__ == "__main__":
    import sys

    if len(sys.argv) != 2:
        print("Usage: python medical_bill_detector.py <image_path>")
        sys.exit(1)

    result = process_medical_bill(sys.argv[1])
    print(json.dumps(result, indent=2))
