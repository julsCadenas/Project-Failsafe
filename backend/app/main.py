from fastapi import FastAPI
from app.api import router as api_router

app = FastAPI(
    title="Superhero Chatbot API",
    description="A conversational AI powered by Gemini 2.5-Flash, Chroma, and HF embeddings",
    version="1.0.0"
)

app.include_router(api_router, prefix="/api")