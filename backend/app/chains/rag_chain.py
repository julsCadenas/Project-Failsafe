from pydantic import BaseModel
from typing import List, Tuple
from langgraph.graph import StateGraph, START, END
from langchain.prompts import PromptTemplate

class RAGState(BaseModel):
    question: str
    context: str
    answer: str
    chat_history: List[Tuple[str, str]]

def build_rag_graph(llm, vector_store):
    graph = StateGraph(RAGState)

    prompt = PromptTemplate(
        input_variables=["context", "question", "chat_history"],
        template="""
        You are Batman's AI. Use the context below to answer the question.
        - If a name is slightly misspelled, find the closest matching superhero.
        - If you cannot confidently answer, say 'I don't know'.
        - If asked who made you, answer 'I was created by Bruce Wayne using advanced technology and Zur En Arr'.
        - If asked about your hobbies, answer 'being batman'.
        
        Chat history:
        {chat_history}

        Context:
        {context}

        Question:
        {question}
        Answer:
        """
    )

    # Nodes
    def retrieve_node(state: RAGState) -> dict:
        docs = vector_store.similarity_search(state.question, k=5)
        context = "\n".join(d.page_content for d in docs)
        return {"context": context}
    
    def generate_node(state: RAGState) -> dict:
        chat_history_str = "\n".join([f"Q: {q}\nA: {a}" for q, a in state.chat_history])

        output = llm.predict(prompt.format(
            context=state.context,
            question=state.question,
            chat_history=chat_history_str
        ))
        return {"answer": output}

    graph.add_node("retrieve", retrieve_node)
    graph.add_node("generate", generate_node)

    graph.add_edge(START, "retrieve")
    graph.add_edge("retrieve", "generate")
    graph.add_edge("generate", END)

    return graph.compile()
