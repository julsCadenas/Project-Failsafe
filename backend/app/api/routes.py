from fastapi import APIRouter
from pydantic import BaseModel
from app.core.embeddings import hf_embeddings
from app.core.vector_store import get_vector_store
from app.core.llm import get_llm
from app.chains.rag_chain import rag_chain
from typing import Optional
import re, uuid

router = APIRouter()

vector_store = get_vector_store(hf_embeddings)
llm = get_llm()
chat_chain = rag_chain(llm, vector_store)
chat_histories: dict[str, list[tuple[str, str]]] = {}


class ChatRequest(BaseModel):
    question: str
    session_id: Optional[str] = None


def normalize_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9 ]", "", text)
    return text


@router.post("/chat")
def chat_superhero(payload: ChatRequest):
    # Create a new session if none is provided
    session_id = payload.session_id or str(uuid.uuid4())

    if session_id not in chat_histories:
        chat_histories[session_id] = []

    history = chat_histories[session_id]

    response = chat_chain.invoke({
        "question": payload.question,
        "chat_history": history
    })

    answer = response.get("answer", "I don't know")

    # Update chat history
    history.append((payload.question, answer))
    chat_histories[session_id] = history

    return {
        "session_id": session_id,
        "question": payload.question,
        "answer": answer,
        "history": history
    }
