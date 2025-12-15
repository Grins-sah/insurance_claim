from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import db
from bson import ObjectId
from fastapi import HTTPException

# Import Routers
from app.routes.health_routes import router as health_router
from app.routes.vehicle_routes import router as vehicle_router
from app.routes.rag_routes import router as rag_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health_router, prefix="/health", tags=["Health Insurance"])
app.include_router(vehicle_router, prefix="/vehicle", tags=["Vehicle Insurance"])
app.include_router(rag_router, prefix="/rag", tags=["RAG Pipeline"])

def serialize_doc(doc):
    if doc:
        doc['_id'] = str(doc['_id'])
    return doc

@app.get("/uploads/{object_id}")
async def get_upload_data(object_id: str):
    try:
        oid = ObjectId(object_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")
    document = db.uploads.find_one({"_id": oid}) 
    if not document:
        raise HTTPException(status_code=404, detail="File data not found")
    return serialize_doc(document)


