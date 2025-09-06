from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field
from beanie import Document
from pymongo import IndexModel

from .user import DifficultyLevel, QuizTopic


class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    SHORT_ANSWER = "short_answer"


class Question(BaseModel):
    id: str
    question: str
    options: List[str] = []
    correct_answer: str
    explanation: Optional[str] = None
    difficulty: DifficultyLevel
    topic: QuizTopic
    question_type: QuestionType = QuestionType.MULTIPLE_CHOICE
    time_limit: int = 30  # seconds


class QuizConfig(BaseModel):
    topic: QuizTopic
    difficulty: DifficultyLevel
    num_questions: int = Field(default=5, ge=1, le=50)
    time_per_question: int = Field(default=30, ge=10, le=300)  # seconds
    total_time_limit: Optional[int] = None  # seconds, None for no limit
    adaptive_difficulty: bool = True


class QuizSession(Document):
    user_id: str
    config: QuizConfig
    questions: List[Question]
    current_question_index: int = 0
    answers: Dict[str, str] = {}  # question_id -> user_answer
    question_times: Dict[str, float] = {}  # question_id -> time_taken
    start_time: datetime
    end_time: Optional[datetime] = None
    score: Optional[int] = None
    is_completed: bool = False
    
    class Settings:
        name = "quiz_sessions"
        indexes = [
            IndexModel([("user_id", 1)]),
            IndexModel([("start_time", -1)]),
            IndexModel([("is_completed", 1)])
        ]


class QuizResult(Document):
    session_id: str
    user_id: str
    topic: QuizTopic
    difficulty: DifficultyLevel
    total_questions: int
    correct_answers: int
    score_percentage: float
    total_time: float  # seconds
    average_time_per_question: float
    question_results: List[Dict] = []  # detailed results per question
    completed_at: datetime
    
    class Settings:
        name = "quiz_results"
        indexes = [
            IndexModel([("user_id", 1)]),
            IndexModel([("completed_at", -1)]),
            IndexModel([("topic", 1)]),
            IndexModel([("difficulty", 1)])
        ]


class QuizAnswer(BaseModel):
    question_id: str
    answer: str
    time_taken: float  # seconds


class AIFeedback(Document):
    user_id: str
    weak_topics: List[QuizTopic]
    strong_topics: List[QuizTopic]
    recommended_difficulty: DifficultyLevel
    suggested_topics: List[QuizTopic]
    improvement_suggestions: List[str]
    generated_at: datetime = Field(default_factory=datetime.now)
    
    class Settings:
        name = "ai_feedback"
        indexes = [
            IndexModel([("user_id", 1)]),
            IndexModel([("generated_at", -1)])
        ]


class PerformanceAnalytics(Document):
    user_id: str
    total_quizzes: int
    accuracy_by_topic: Dict[str, float]
    accuracy_by_difficulty: Dict[str, float]
    average_time_by_topic: Dict[str, float]
    improvement_trend: Dict[str, List[float]]  # topic -> [scores over time]
    quiz_frequency: Dict[str, int]  # date -> number of quizzes
    generated_at: datetime = Field(default_factory=datetime.now)
    
    class Settings:
        name = "performance_analytics"
        indexes = [
            IndexModel([("user_id", 1)]),
            IndexModel([("generated_at", -1)])
        ]
