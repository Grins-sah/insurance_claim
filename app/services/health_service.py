import os
from pinecone import Pinecone
from app.services.RAG_init import model
from app.services.prompts import HEALTH_CLAIM_PROMPT
from app.services.hf_query import QueryHuggingFace

class HealthClaimService:
    def __init__(self):
        self.pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        self.index = self.pc.Index("insurance-claims")
        self.llm_client = QueryHuggingFace(model_name="Qwen/Qwen2.5-72B-Instruct")

    def validate_claim(self, claim_text, object_id):
        query_embedding = model.encode(claim_text[:1000]).tolist()

        # Filter by object_id to ensure we only get context from the relevant document
        results = self.index.query(
            vector=query_embedding,
            top_k=3,
            include_metadata=True,
            filter={"source_id": str(object_id)}
        )

        context = "\n\n".join([match['metadata']['text'] for match in results['matches']])

        # 2. Generate Analysis
        # Format the prompt using the template
        prompt = HEALTH_CLAIM_PROMPT.format(context=context, claim_details=claim_text)
        
        # Query the Hugging Face model
        response_content = self.llm_client.query(prompt)

        return response_content
