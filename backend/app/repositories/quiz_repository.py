from typing import Optional, List, Dict
from datetime import datetime
from beanie import PydanticObjectId
from app.models.quiz import (
    QuizSession, QuizResult, AIFeedback, PerformanceAnalytics,
    QuizConfig, Question, DifficultyLevel, QuizTopic
)


class QuizRepository:
    """Repository for quiz data operations"""
    
    @staticmethod
    async def create_quiz_session(user_id: str, config: QuizConfig, questions: List[Question]) -> QuizSession:
        """Create a new quiz session"""
        session = QuizSession(
            user_id=user_id,
            config=config,
            questions=questions,
            start_time=datetime.now()
        )
        await session.insert()
        return session
    
    @staticmethod
    async def get_quiz_session(session_id: str) -> Optional[QuizSession]:
        """Get quiz session by ID"""
        try:
            return await QuizSession.get(PydanticObjectId(session_id))
        except Exception:
            return None
    
    @staticmethod
    async def update_quiz_session(session: QuizSession) -> bool:
        """Update quiz session"""
        try:
            await session.save()
            return True
        except Exception:
            return False
    
    @staticmethod
    async def get_user_quiz_sessions(user_id: str, limit: int = 10) -> List[QuizSession]:
        """Get user's quiz sessions"""
        return await QuizSession.find(
            QuizSession.user_id == user_id
        ).sort(-QuizSession.start_time).limit(limit).to_list()
    
    @staticmethod
    async def get_active_quiz_sessions(user_id: str) -> List[QuizSession]:
        """Get user's active (incomplete) quiz sessions"""
        return await QuizSession.find(
            QuizSession.user_id == user_id,
            QuizSession.is_completed == False
        ).to_list()
    
    @staticmethod
    async def save_quiz_result(result: QuizResult) -> QuizResult:
        """Save quiz result"""
        await result.insert()
        return result
    
    @staticmethod
    async def get_quiz_results(user_id: str, limit: int = 20) -> List[QuizResult]:
        """Get user's quiz results"""
        return await QuizResult.find(
            QuizResult.user_id == user_id
        ).sort(-QuizResult.completed_at).limit(limit).to_list()
    
    @staticmethod
    async def get_quiz_results_by_topic(user_id: str, topic: QuizTopic) -> List[QuizResult]:
        """Get user's quiz results for a specific topic"""
        return await QuizResult.find(
            QuizResult.user_id == user_id,
            QuizResult.topic == topic
        ).sort(-QuizResult.completed_at).to_list()
    
    @staticmethod
    async def get_quiz_results_by_difficulty(user_id: str, difficulty: DifficultyLevel) -> List[QuizResult]:
        """Get user's quiz results for a specific difficulty"""
        return await QuizResult.find(
            QuizResult.user_id == user_id,
            QuizResult.difficulty == difficulty
        ).sort(-QuizResult.completed_at).to_list()
    
    @staticmethod
    async def save_ai_feedback(feedback: AIFeedback) -> AIFeedback:
        """Save AI feedback"""
        await feedback.insert()
        return feedback
    
    @staticmethod
    async def get_latest_ai_feedback(user_id: str) -> Optional[AIFeedback]:
        """Get user's latest AI feedback"""
        return await AIFeedback.find(
            AIFeedback.user_id == user_id
        ).sort(-AIFeedback.generated_at).first()
    
    @staticmethod
    async def save_performance_analytics(analytics: PerformanceAnalytics) -> PerformanceAnalytics:
        """Save performance analytics"""
        await analytics.insert()
        return analytics
    
    @staticmethod
    async def get_latest_performance_analytics(user_id: str) -> Optional[PerformanceAnalytics]:
        """Get user's latest performance analytics"""
        return await PerformanceAnalytics.find(
            PerformanceAnalytics.user_id == user_id
        ).sort(-PerformanceAnalytics.generated_at).first()
    
    @staticmethod
    async def get_user_statistics(user_id: str) -> Dict:
        """Get comprehensive user statistics"""
        results = await QuizRepository.get_quiz_results(user_id, limit=100)
        
        if not results:
            return {
                "total_quizzes": 0,
                "total_questions": 0,
                "correct_answers": 0,
                "accuracy": 0.0,
                "topics_attempted": [],
                "difficulties_attempted": []
            }
        
        total_quizzes = len(results)
        total_questions = sum(r.total_questions for r in results)
        correct_answers = sum(r.correct_answers for r in results)
        accuracy = (correct_answers / total_questions * 100) if total_questions > 0 else 0
        
        topics_attempted = list(set(r.topic for r in results))
        difficulties_attempted = list(set(r.difficulty for r in results))
        
        return {
            "total_quizzes": total_quizzes,
            "total_questions": total_questions,
            "correct_answers": correct_answers,
            "accuracy": round(accuracy, 2),
            "topics_attempted": topics_attempted,
            "difficulties_attempted": difficulties_attempted
        }
