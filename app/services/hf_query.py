from huggingface_hub import InferenceClient
import os
import dotenv

dotenv.load_dotenv()
hf_api_token = os.getenv("HF_API_TOKEN")

class QueryHuggingFace:
    def __init__(self, model_name="Qwen/Qwen2.5-72B-Instruct"):
        self.client = InferenceClient(model=model_name, token=hf_api_token)

    def query(self, prompt_text):
        messages = [
            {"role": "user", "content": prompt_text}
        ]
        response = self.client.chat_completion(messages, max_tokens=1000)
        return response.choices[0].message.content
