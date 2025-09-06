import os
import tempfile
import uuid
from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, File, HTTPException, UploadFile, Query, Depends
from fastapi import status

from app.services.extract import extract_text_auto
from app.services.gemini import generate_quiz_questions, generate_ai_feedback
from app.services.quiz_service import QuizService, PerformanceService
from app.models.quiz import (
    QuizConfig, QuizSession, QuizResult, QuizAnswer, 
    AIFeedback, PerformanceAnalytics
)
from app.models.user import DifficultyLevel, QuizTopic


router = APIRouter()
quiz_service = QuizService()
performance_service = PerformanceService()

CHUNK_SIZE = 1024 * 1024  # 1MB per chunk


@router.post("/generate", response_model=List[dict])
async def generate_quiz(file: UploadFile = File(...), num_questions: int = Query(5, ge=1, le=100)):
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File name required")

    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp_path = tmp.name
        # Stream copy to avoid loading entire file into memory
        while True:
            chunk = await file.read(CHUNK_SIZE)
            if not chunk:
                break
            tmp.write(chunk)

    try:
        text = extract_text_auto(tmp_path, file.filename)
        questions = generate_quiz_questions(text, num_questions=num_questions)
        return questions
    finally:
        try:
            os.remove(tmp_path)
        except Exception:
            pass


@router.post("/create-session", response_model=QuizSession)
async def create_quiz_session(
    config: QuizConfig,
    user_id: str = Query(...)
):
    """Create a new quiz session with specified configuration"""
    try:
        session = await quiz_service.create_session(user_id, config)
        return session
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/session/{session_id}", response_model=QuizSession)
async def get_quiz_session(session_id: str):
    """Get current quiz session details"""
    session = await quiz_service.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Quiz session not found")
    return session


@router.post("/session/{session_id}/answer")
async def submit_answer(session_id: str, answer: QuizAnswer):
    """Submit answer for current question"""
    try:
        result = await quiz_service.submit_answer(session_id, answer)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/session/{session_id}/complete", response_model=QuizResult)
async def complete_quiz(session_id: str):
    """Complete the quiz and get results"""
    try:
        result = await quiz_service.complete_quiz(session_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/topics", response_model=List[str])
async def get_available_topics():
    """Get list of available quiz topics"""
    return [topic.value for topic in QuizTopic]


@router.get("/difficulties", response_model=List[str])
async def get_difficulty_levels():
    """Get list of available difficulty levels"""
    return [level.value for level in DifficultyLevel]


@router.get("/user/{user_id}/performance", response_model=PerformanceAnalytics)
async def get_user_performance(user_id: str):
    """Get user performance analytics"""
    try:
        analytics = await performance_service.get_user_analytics(user_id)
        return analytics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/user/{user_id}/recommendations", response_model=AIFeedback)
async def get_ai_recommendations(user_id: str):
    """Get AI-powered recommendations for user improvement"""
    try:
        feedback = await performance_service.generate_ai_feedback(user_id)
        return feedback
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/user/{user_id}/suggested-difficulty")
async def get_suggested_difficulty(user_id: str, topic: QuizTopic):
    """Get AI-suggested difficulty level based on user performance"""
    try:
        difficulty = await performance_service.suggest_difficulty(user_id, topic)
        return {"suggested_difficulty": difficulty.value}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


