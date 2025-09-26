from huggingface_hub import InferenceClient
from app.config import settings

class HfEmbeddings:
    def __init__(self):
        self.client = InferenceClient(
            provider="auto",
            api_key=settings.HF_TOKEN,
        )
        self.model = settings.GEMINI_MODEL
    
    def embed_text(self, texts):
        if isinstance(texts, str):
            texts = [texts]
        return self.client.feature_extraction(texts, model=self.model)