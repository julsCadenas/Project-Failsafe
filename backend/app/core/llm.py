from langchain.chat_models import init_chat_model
from app.config import settings

def get_llm():
    return init_chat_model(
        model = settings.GEMINI_MODEL,
        model_provider = settings.MODEL_PROVIDER,
        api_key = settings.GEMINI_API_KEY,
    )