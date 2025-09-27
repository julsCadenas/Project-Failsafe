from pydantic import BaseModel
from typing import List, Tuple
from langgraph.graph import StateGraph, START, END
from langchain.prompts import PromptTemplate
import logging
from langchain.schema import BaseMessage

logger = logging.getLogger(__name__)

class RAGState(BaseModel):
    question: str
    context: str = ""
    answer: str = ""
    chat_history: List[Tuple[str, str]] = []

def build_rag_graph(llm, vector_store, k: int = 30, history_window: int = 10):
    """
    Builds a retrieval-augmented generation graph.
    """
    graph = StateGraph(RAGState)

    prompt_template = PromptTemplate(
        input_variables=["conversation_context", "context", "question"],
        template="""
            You are the Bat-Computer. Be concise and helpful.
            - Correct minor misspellings in names.
            - Improvise if unsure.
            - Admit if you really don't know.
            - Sum numeric values for stats.
            - Creator: 'I was created by Bruce Wayne using advanced technology and Zur En Arr.'
            - Hobbies: 'being batman'

            Conversation so far:
            {conversation_context}

            Context (facts retrieved from database):
            {context}

            User's next question:
            {question}

            Answer:
        """
    )

    def retrieve_node(state: RAGState) -> dict:
        try:
            docs = vector_store.similarity_search(state.question, k=k)
            context_text = "\n".join(d.page_content for d in docs)
        except Exception as e:
            logger.error(f"Vector store retrieval failed: {e}")
            context_text = ""
        return {"context": context_text}

    def generate_node(state: RAGState) -> dict:
        recent_history = state.chat_history[-history_window:]
        conversation_context = "\n".join([f"User: {q}\nAssistant: {a}" for q, a in recent_history])
        
        try:
            raw_output = llm.invoke(prompt_template.format(
                conversation_context=conversation_context,
                context=state.context,
                question=state.question
            ))
            
            if isinstance(raw_output, BaseMessage):
                answer = raw_output.content
            elif hasattr(raw_output, 'content'):
                answer = raw_output.content
            elif isinstance(raw_output, str):
                answer = raw_output
            else:
                answer = str(raw_output)
                
        except Exception as e:
            logger.error(f"LLM invocation failed: {e}")
            answer = "Sorry, I couldn't generate an answer."
        
        return {"answer": answer}
    graph.add_node("retrieve", retrieve_node)
    graph.add_node("generate", generate_node)
    graph.add_edge(START, "retrieve")
    graph.add_edge("retrieve", "generate")
    graph.add_edge("generate", END)

    return graph.compile()
