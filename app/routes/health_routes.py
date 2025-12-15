from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from app.services.health_service import HealthClaimService

router = APIRouter()

class ClaimRequest(BaseModel):
    object_ids: List[str]
    query: str

@router.post("/validate_claim")
async def validate_claim_endpoint(request: ClaimRequest):
    if not request.object_ids:
        raise HTTPException(status_code=400, detail="object_ids list cannot be empty")
    
    if not request.query:
        raise HTTPException(status_code=400, detail="query cannot be empty")

    try:
        validator = HealthClaimService()
        analysis = validator.validate_claim(request.query, request.object_ids)
        
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
