from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import re

from app.core.embeddings import hf_embeddings
from app.core.vector_store import get_vector_store
from app.core.llm import get_llm
from app.chains.rag_chain import build_rag_graph
from app.services.chat_service import process_chat

router = APIRouter()

vector_store = get_vector_store(hf_embeddings)
llm = get_llm()
graph = build_rag_graph(llm, vector_store)

class ChatRequest(BaseModel):
    question: str
    session_id: Optional[str] = None

@router.post("/chat")
def failsafe(payload: ChatRequest):
    session_id, answer, history = process_chat(
        graph, payload.question, payload.session_id
    )
    return {
        "session_id": session_id,
        "question": payload.question,
        "answer": answer,
        "history": history
    }
