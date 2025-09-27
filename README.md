# Bat-Computer

Project **Bat-Computer** is an AI-powered chatbot inspired by Batman's legendary Bat-Computer. It provides detailed information about superheroes from various universes using a **Retrieval-Augmented Generation (RAG)** approach orchestrated with **LangGraph**.

## Features

- **RAG-Powered Knowledge:** Combines a local superhero database with advanced AI to deliver accurate, context-aware answers.  
- **Superhero Database:** Access data about heroes, their abilities, weaknesses, backgrounds, and contingency plans.  
- **Conversational AI:** Ask natural language questions and receive detailed responses.  
- **Extensible:** Easily add new heroes or update existing profiles for up-to-date intelligence.  
- **LangGraph:** Manages the flow between retrieval, reasoning, and response generation.  

## How It Works

1. **Retrieval:** When a question is asked, relevant hero data is fetched from **Chroma DB** using semantic search powered by `sentence-transformers/all-mpnet-base-v2`.  
2. **Orchestration (LangGraph):** LangGraph controls the flow of data, ensures relevant context is passed to the model, and allows multi-step reasoning across different nodes.  
3. **Generation:** The retrieved and processed data is passed to **Gemini 2.5 Flash**, which generates a coherent, informative response.  

> This combination ensures the system provides both factual accuracy and natural conversational output, typical of a RAG architecture.

## Inspiration

Inspired by Batman's contingency plans, the project emphasizes preparedness and knowledge, aiming to **“know everything about every hero.”**

## Tech Stack

- **Gemini 2.5 Flash:** Conversational AI engine for generating natural language responses.  
- **LangGraph:** Orchestration framework for managing RAG flows and multi-step reasoning.  
- **Chroma DB (Local):** Fast vector database for storing and retrieving hero embeddings.  
- **sentence-transformers/all-mpnet-base-v2:** Pre-trained embedding model from Hugging Face for semantic search.  
- **Python & FastAPI:** Backend API for handling queries and orchestrating retrieval + generation.  

**Status:** 🚧 WIP
