import os
import json
from pinecone import Pinecone
from app.services.RAG_init import model
from app.services.prompts import HEALTH_CLAIM_PROMPT
from app.services.hf_query import QueryHuggingFace

class HealthClaimService:
    def __init__(self):
        self.pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        self.index = self.pc.Index("insurance-claims")
        self.llm_client = QueryHuggingFace(model_name="Qwen/Qwen2.5-72B-Instruct")

    def validate_claim(self, query, object_ids, medical_bill_data=None, prescription_data=None):
        query_embedding = model.encode(query).tolist()

        # Filter by object_ids to ensure we only get context from the relevant documents
        filter_dict = {"source_id": {"$in": [str(oid) for oid in object_ids]}}
        
        results = self.index.query(
            vector=query_embedding,
            top_k=5, # Increased top_k since we might have multiple documents
            include_metadata=True,
            filter=filter_dict
        )

        context = "\n\n".join([match['metadata']['text'] for match in results['matches']])

        # Construct comprehensive claim details
        claim_details_text = f"User Query/Description: {query}\n\n"
        
        if medical_bill_data:
            claim_details_text += f"--- EXTRACTED MEDICAL BILL DATA ---\n{json.dumps(medical_bill_data, indent=2)}\n\n"
            
        if prescription_data:
            claim_details_text += f"--- EXTRACTED PRESCRIPTION DATA ---\n{json.dumps(prescription_data, indent=2)}\n\n"

        # 2. Generate Analysis
        # Format the prompt using the template
        prompt = HEALTH_CLAIM_PROMPT.format(context=context, claim_details=claim_details_text)
        
        # Query the Hugging Face model
        response_content = self.llm_client.query(prompt)

        return response_content
