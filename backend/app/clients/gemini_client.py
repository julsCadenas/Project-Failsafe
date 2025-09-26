from google import genai
from app.config import settings

class GeminiLLM:
    def __init__(self):
        self.client = genai.Client()
        self.model = settings.GEMINI_MODEL
        
    def generate(self, prompt):
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt
        )
        return response.text