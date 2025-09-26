import chromadb
from app.config import settings

class ChromaDBClient:
    def __init__(self):
        self.client = chromadb.HttpClient(host=settings.CHROMA_HOST, port=settings.CHROMA_PORT)
        self.collection = self.client.get_collection(name=settings.COLLECTION_NAME)
    
    def query(self, query_embedddings, n_results=50):
        return self.collection.query(
            query_embeddings=query_embedddings,
            n_results=n_results,
        )

    def list_collections(self):
        return self.client.list_collections()