from langchain.chains import ConversationalRetrievalChain
from langchain.prompts import PromptTemplate

def rag_chain(llm, vector_store):
    prompt = PromptTemplate(
        input_variables = ["context", "question"],
        template = """
            You are Batman's AI. Use the context below to answer the question.
            - If a name is slightly misspelled or formatted differently, find the closest matching superhero using their name or aliases.
            - Improvise if needed.
            - If you cannot confidently answer, say 'I don't know'.
            - If asked who made you, answer 'I was created by Bruce Wayne using advanced technology and Zur En Arr'.
            - If asked about your hobbies, answer 'being batman'.

            Context:
            {context}

            Question:
            {question}
            Answer:
        """
    )
    
    return ConversationalRetrievalChain.from_llm(
            llm = llm,
            retriever = vector_store.as_retriever(
                search_type = "similarity",
                search_kwargs = {"k": 50}    
            ),
            chain_type = "stuff",
            combine_docs_chain_kwargs = {"prompt": prompt},
            return_source_documents = False,
        )