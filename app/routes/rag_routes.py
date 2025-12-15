from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.services.RAG_init import RAG_Init, pinecone_api_key, dim

router = APIRouter()

@router.post("/process/{object_id}")
async def process_document_for_rag(object_id: str):
    """
    Triggers the RAG processing pipeline for a specific document.
    1. Fetches the document from MongoDB.
    2. Chunks the extracted text.
    3. Generates embeddings.
    4. Uploads vectors to Pinecone.
    """
    try:
        # Validate ObjectId
        try:
            oid = ObjectId(object_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid ObjectId format")

        # Initialize and run RAG pipeline
        # Note: RAG_Init fetches the document internally using the object_id (as ObjectId or string? 
        # Let's check RAG_Init.scan_for_documents. It uses self.object_id directly in find_one.
        # If it expects ObjectId, we should pass ObjectId. If string, string.
        # In RAG_init.py: document = db.uploads.find_one({"_id": self.object_id})
        # Usually _id is ObjectId. Let's pass the ObjectId object 'oid'.
        
        rag_processor = RAG_Init(pinecone_api_key, dim, oid)
        rag_processor.initialize()
        
        return {"message": "Document processed and uploaded to Pinecone successfully", "object_id": object_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG processing failed: {str(e)}")
