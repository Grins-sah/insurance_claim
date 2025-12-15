from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.database import db
from app.services.health_service import HealthClaimService

router = APIRouter()

@router.post("/validate_claim/{object_id}")
async def validate_claim_endpoint(object_id: str):
    try:
        oid = ObjectId(object_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")
    
    document = db.uploads.find_one({"_id": oid})
    if not document:
        raise HTTPException(status_code=404, detail="File data not found")
    
    claim_text = document.get('extracted_text')
    if not claim_text:
        raise HTTPException(status_code=400, detail="No extracted text found in document")

    validator = HealthClaimService()
    analysis = validator.validate_claim(claim_text, object_id)
    
    return {"analysis": analysis}
