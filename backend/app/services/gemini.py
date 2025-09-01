from typing import List

import google.generativeai as genai

from app.core.config import settings


def configure_gemini() -> None:
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured")
    genai.configure(api_key=settings.gemini_api_key)


def generate_quiz_questions(context_text: str, num_questions: int = 5) -> List[dict]:
    configure_gemini()
    model = genai.GenerativeModel("gemini-2.0-flash-exp")
    prompt = (
        "You are a helpful tutor. Based on the provided study material, create a JSON array of"
        f" {num_questions} multiple-choice questions. Each item must have fields: question (string),"
        " options (array of 4 strings), answerIndex (0-3 integer), and explanation (string)."
        " Only return strict JSON without code fences or commentary.\n\nStudy material:\n" + context_text
    )
    response = model.generate_content(prompt)
    text = response.text.strip()
    # Best effort: if model wraps in code fences, strip them
    if text.startswith("```"):
        text = text.strip("`")
        if text.startswith("json"):
            text = text[4:]
    import json

    try:
        data = json.loads(text)
        assert isinstance(data, list)
        return data
    except Exception:
        # Fallback: return a single simple question
        return [
            {
                "question": "What is the main idea of the provided material?",
                "options": ["Concept A", "Concept B", "Concept C", "Concept D"],
                "answerIndex": 0,
                "explanation": "Model output could not be parsed; this is a placeholder.",
            }
        ]


