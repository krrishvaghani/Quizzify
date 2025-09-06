from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, EmailStr, Field
from beanie import Document
from pymongo import IndexModel


class DifficultyLevel(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class QuizTopic(str, Enum):
    MATH = "math"
    SCIENCE = "science"
    HISTORY = "history"
    LITERATURE = "literature"
    GEOGRAPHY = "geography"
    TECHNOLOGY = "technology"
    GENERAL = "general"


class UserPerformance(BaseModel):
    topic: QuizTopic
    difficulty: DifficultyLevel
    correct_answers: int
    total_questions: int
    average_time: float  # in seconds
    last_quiz_date: datetime


class UserStats(BaseModel):
    total_quizzes: int = 0
    total_questions: int = 0
    correct_answers: int = 0
    performance_by_topic: Dict[str, UserPerformance] = {}
    preferred_topics: List[QuizTopic] = []
    current_difficulty: DifficultyLevel = DifficultyLevel.EASY


class UserIn(BaseModel):
    email: EmailStr
    password: str


class UserDB(Document):
    email: EmailStr
    password_hash: Optional[str] = None  # Optional for Google OAuth users
    stats: UserStats = Field(default_factory=UserStats)
    created_at: datetime = Field(default_factory=datetime.now)
    
    # Google OAuth fields
    google_id: Optional[str] = None
    name: Optional[str] = None
    given_name: Optional[str] = None
    family_name: Optional[str] = None
    picture: Optional[str] = None
    auth_provider: str = "email"  # "email" or "google"
    
    class Settings:
        name = "users"
        indexes = [
            IndexModel([("email", 1)], unique=True),
            IndexModel([("google_id", 1)], unique=True, sparse=True),
            IndexModel([("created_at", -1)])
        ]


class UserOut(BaseModel):
    id: str
    email: EmailStr
    stats: UserStats


