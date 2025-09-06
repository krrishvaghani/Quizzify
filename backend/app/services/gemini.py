from typing import List, Dict, Any, Optional
import json
import os

import google.generativeai as genai

from app.core.config import settings
from app.models.user import DifficultyLevel, QuizTopic
from ..models.quiz import Question, AIFeedback


def configure_gemini() -> None:
    genai.configure(api_key="AIzaSyDZsOqzKz3p3Cld7MHuzjfd6txaVUaHcjE")


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


def generate_adaptive_questions(topic: QuizTopic, difficulty: DifficultyLevel, num_questions: int = 5) -> List[dict]:
    """Generate questions for specific topic and difficulty level"""
    configure_gemini()
    model = genai.GenerativeModel("gemini-2.0-flash-exp")
    
    prompt = (
        f"Generate {num_questions} {difficulty.value} level multiple-choice questions about {topic.value}. "
        "Return a JSON array where each question has: question (string), options (array of 4 strings), "
        "answerIndex (0-3 integer), and explanation (string). Only return strict JSON without code fences."
    )
    
    response = model.generate_content(prompt)
    text = response.text.strip()
    
    if text.startswith("```"):
        text = text.strip("`")
        if text.startswith("json"):
            text = text[4:]

    try:
        data = json.loads(text)
        assert isinstance(data, list)
        return data
    except Exception:
        # Fallback questions based on topic and difficulty
        return _get_fallback_questions(topic, difficulty, num_questions)


def generate_ai_feedback(user_performance: Dict) -> Dict:
    """Generate AI feedback based on user performance data"""
    configure_gemini()
    model = genai.GenerativeModel("gemini-2.0-flash-exp")
    
    prompt = (
        f"Analyze this user's quiz performance data and provide educational feedback: {user_performance}. "
        "Return JSON with: weak_topics (array), strong_topics (array), improvement_suggestions (array of strings), "
        "and recommended_difficulty (easy/medium/hard). Only return strict JSON."
    )
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        if text.startswith("```"):
            text = text.strip("`")
            if text.startswith("json"):
                text = text[4:]
        
        return json.loads(text)
    except Exception:
        # Fallback feedback
        return {
            "weak_topics": ["science", "technology"],
            "strong_topics": ["history", "literature"],
            "improvement_suggestions": [
                "Practice more science fundamentals",
                "Review technology concepts regularly"
            ],
            "recommended_difficulty": "medium"
        }


def _get_fallback_questions(topic: QuizTopic, difficulty: DifficultyLevel, num_questions: int) -> List[dict]:
    """Fallback questions when AI generation fails"""
    fallback_questions = {
        QuizTopic.MATH: {
            DifficultyLevel.EASY: [
                {
                    "question": "What is 5 + 3?",
                    "options": ["6", "7", "8", "9"],
                    "answerIndex": 2,
                    "explanation": "5 + 3 = 8"
                }
            ]
        }
    }
    
    questions = fallback_questions.get(topic, {}).get(difficulty, [])
    return questions[:num_questions] if questions else [
        {
            "question": f"Sample {difficulty.value} {topic.value} question",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answerIndex": 0,
            "explanation": "This is a fallback question."
        }
    ]


