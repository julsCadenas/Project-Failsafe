from app.config import settings
from huggingface_hub import InferenceClient
from langchain.embeddings.base import Embeddings

hf_client = InferenceClient(provider="auto", api_key=settings.HF_TOKEN)

class HFInferenceEmbeddings(Embeddings):
    def __init__(self, client=hf_client, model=settings.EMBEDDING_MODEL):
        self.client = client
        self.model = model
        
    def embed_documents(self, texts):
        embeddings = self.client.feature_extraction(texts, model=self.model)
        return [emb for emb in embeddings]
        
    def embed_query(self, text):
        return self.client.feature_extraction([text], model=self.model)[0]
    
hf_embeddings = HFInferenceEmbeddings()
        