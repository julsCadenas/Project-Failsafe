from fastapi import FastAPI
from pydantic import BaseModel
import uuid

from app.config import settings
from app.clients.chroma_client import ChromaDBClient
from app.clients.huggingface_client import HfEmbeddings
from app.clients.gemini_client import GeminiLLM
from app.memory.session_memory import SessionMemoryManager

app = FastAPI(title="Superhero RAG Chatbot")

chroma_client = ChromaDBClient()
hf_client = HfEmbeddings()
gemini_llm = GeminiLLM()
memory_manager = SessionMemoryManager()

# Routes
@app.get("/")
def home():
    return {"message": "RAG Superhero Chatbot running. POST /chat with JSON {'question': str}"}
