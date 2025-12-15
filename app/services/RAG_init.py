import os
import io
from pypdf import PdfReader
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
        print("Document fetched for RAG processing.")
        self.chucking_of_documents()
        print(f"Document chunked into {len(self.chunks)} pieces.")
        self.store_in_pinecone()
        print("Document vectors stored in Pinecone successfully.")

    def chucking_of_documents(self):
        text = self.document.get('extracted_text')
        
        if not text:
            # If extracted_text is missing, try to extract from 'data' field (raw bytes)
            raw_data = self.document.get('data')
            
            if raw_data:
                # Handle bson.binary.Binary or other binary types
                if not isinstance(raw_data, bytes) and hasattr(raw_data, '__bytes__'):
                    raw_data = bytes(raw_data)

                if isinstance(raw_data, bytes):
                    try:
                        # Attempt to read as PDF
                        pdf_stream = io.BytesIO(raw_data)
                        reader = PdfReader(pdf_stream)
                        extracted_pages = []
                        for page in reader.pages:
                            page_text = page.extract_text()
                            if page_text:
                                extracted_pages.append(page_text)
                        text = "\n".join(extracted_pages)
                    except Exception as e:
                        print(f"PDF extraction failed, falling back to text decode: {e}")
                        # Fallback: Try decoding as UTF-8
                        try:
                            text = raw_data.decode('utf-8')
                        except UnicodeDecodeError:
                            text = raw_data.decode('utf-8', errors='replace')
                elif isinstance(raw_data, str):
                    text = raw_data

        if not text:
            raise ValueError("Document has no text content to process.")
        try:
            db.uploads.update_one(
                {"_id": self.object_id},
                {"$set": {"extracted_text": text}}
            )
            print(f"Extracted text saved to database for document {self.object_id}")
        except Exception as e:
            print(f"Failed to update document with extracted text: {e}")

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
        print("Pinecone index is ready.")
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