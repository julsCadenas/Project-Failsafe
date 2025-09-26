from langchain_chroma import Chroma
import chromadb
from app.config import settings

CHROMA_HOST = settings.CHROMA_HOST
CHROMA_PORT = settings.CHROMA_PORT
COLLECTION_NAME = settings.COLLECTION_NAME
CHROMA_URL = f"http://{CHROMA_HOST}:{CHROMA_PORT}"

def get_vector_store(embeddings):
    return Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=embeddings,
        client=chromadb.HttpClient(host=CHROMA_HOST, port=int(CHROMA_PORT)),
        persist_directory=None,  # remote, so no local persistence
    )
