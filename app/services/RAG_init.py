import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from app.database import db
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pinecone import Pinecone, ServerlessSpec

load_dotenv()
pinecone_api_key = os.getenv("PINECONE_API_KEY")
model = SentenceTransformer('mixedbread-ai/mxbai-embed-large-v1')
dim = model.get_sentence_embedding_dimension()
def serialize_doc(doc):
    if doc:
        doc['_id'] = str(doc['_id'])
    return doc
class RAG_Init:
    def __init__(self, pinecone_api_key, dimension,object_id):
        self.pinecone_api_key = pinecone_api_key
        self.dimension = dimension
        self.object_id = object_id
    def scan_for_documents(self):
        document = db.uploads.find_one({"_id": self.object_id}) 
        if not document:
            raise Exception("File data not found")
        return serialize_doc(document)
    def initialize(self):
        self.document = self.scan_for_documents()
        self.chucking_of_documents()
        self.store_in_pinecone()

    def chucking_of_documents(self):
        text = self.document['extracted_text']
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50
        )
        self.chunks = text_splitter.split_text(text)

    def store_in_pinecone(self):
        pc = Pinecone(api_key=self.pinecone_api_key)
        index_name = "insurance-claims"
        
        existing_indexes = [index.name for index in pc.list_indexes()]
        
        if index_name not in existing_indexes:
            pc.create_index(
                name=index_name,
                dimension=self.dimension,
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="aws",
                    region="us-east-1"
                ) 
            )
        
        index = pc.Index(index_name)
        
        vectors = []
        for i, chunk in enumerate(self.chunks):
            embedding = model.encode(chunk).tolist()
            vectors.append({
                "id": f"{self.object_id}_{i}",
                "values": embedding,
                "metadata": {"text": chunk, "source_id": str(self.object_id)}
            })
            
        batch_size = 100
        for i in range(0, len(vectors), batch_size):
            batch = vectors[i:i+batch_size]
            index.upsert(vectors=batch)