import uuid
from typing import List, Tuple
from app.chains.rag_chain import RAGState

chat_histories: dict[str, List[Tuple[str, str]]] = {}

def process_chat(graph, question: str, session_id: str | None = None):
    session_id = session_id or str(uuid.uuid4())

    history = chat_histories.setdefault(session_id, [])

    initial_state = RAGState(
        question=question,
        chat_history=history
    )

    final_state = graph.invoke(initial_state)
    answer = final_state.get("answer", "")

    history.append((question, answer))
    chat_histories[session_id] = history

    return session_id, answer, history
