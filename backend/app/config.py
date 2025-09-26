import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    CHROMA_HOST: str = os.getenv("CHROMA_HOST", "localhost")
    CHROMA_PORT: int = int(os.getenv("CHROMA_PORT", 8000))
    HF_TOKEN: str = os.getenv("HF_TOKEN")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL: str = "gemini-2.5-flash"
    EMBEDDING_MODEL: str = "sentence-transformers/all-mpnet-base-v2"
    COLLECTION_NAME: str = "superheroes"

settings = Settings()