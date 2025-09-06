import uuid
from typing import Dict, List, Optional
from datetime import datetime, timedelta

from app.models.quiz import (
    QuizConfig, QuizSession, QuizResult, QuizAnswer, Question, QuestionType
)
from app.models.user import DifficultyLevel, QuizTopic
from app.services.gemini import generate_adaptive_questions
from app.repositories.quiz_repository import QuizRepository


class QuizService:
    def __init__(self):
        self.quiz_repo = QuizRepository()

    async def create_session(self, user_id: str, config: QuizConfig) -> QuizSession:
        """Create a new quiz session with generated questions"""
        # Generate questions based on config
        questions = await self._generate_questions(config)
        
        session = await self.quiz_repo.create_quiz_session(
            user_id=user_id,
            config=config,
            questions=questions
        )
        
        return session

    async def get_session(self, session_id: str) -> Optional[QuizSession]:
        """Get quiz session by ID"""
        return await self.quiz_repo.get_quiz_session(session_id)

    async def submit_answer(self, session_id: str, answer: QuizAnswer) -> Dict:
        """Submit answer for current question"""
        session = await self.quiz_repo.get_quiz_session(session_id)
        if not session:
            raise ValueError("Quiz session not found")
        
        if session.is_completed:
            raise ValueError("Quiz already completed")
        
        # Store the answer
        session.answers[answer.question_id] = answer.answer
        session.question_times[answer.question_id] = answer.time_taken
        
        # Move to next question
        session.current_question_index += 1
        
        # Update session in database
        await self.quiz_repo.update_quiz_session(session)
        
        # Check if quiz is completed
        is_last_question = session.current_question_index >= len(session.questions)
        
        result = {
            "is_correct": self._check_answer(session, answer.question_id, answer.answer),
            "is_last_question": is_last_question,
            "next_question_index": session.current_question_index if not is_last_question else None
        }
        
        return result

    async def complete_quiz(self, session_id: str) -> QuizResult:
        """Complete quiz and calculate results"""
        session = await self.quiz_repo.get_quiz_session(session_id)
        if not session:
            raise ValueError("Quiz session not found")
        
        if session.is_completed:
            raise ValueError("Quiz already completed")
        
        session.end_time = datetime.now()
        session.is_completed = True
        
        # Update session in database
        await self.quiz_repo.update_quiz_session(session)
        
        # Calculate results
        correct_answers = 0
        question_results = []
        
        for question in session.questions:
            user_answer = session.answers.get(question.id, "")
            is_correct = self._check_answer(session, question.id, user_answer)
            time_taken = session.question_times.get(question.id, 0)
            
            if is_correct:
                correct_answers += 1
            
            question_results.append({
                "question_id": question.id,
                "question": question.question,
                "user_answer": user_answer,
                "correct_answer": question.correct_answer,
                "is_correct": is_correct,
                "time_taken": time_taken,
                "explanation": question.explanation
            })
        
        total_time = (session.end_time - session.start_time).total_seconds()
        score_percentage = (correct_answers / len(session.questions)) * 100
        
        result = QuizResult(
            session_id=str(session.id),
            user_id=session.user_id,
            topic=session.config.topic,
            difficulty=session.config.difficulty,
            total_questions=len(session.questions),
            correct_answers=correct_answers,
            score_percentage=score_percentage,
            total_time=total_time,
            average_time_per_question=total_time / len(session.questions),
            question_results=question_results,
            completed_at=session.end_time
        )
        
        # Save result to database
        await self.quiz_repo.save_quiz_result(result)
        return result

    def _check_answer(self, session: QuizSession, question_id: str, user_answer: str) -> bool:
        """Check if user answer is correct"""
        question = next((q for q in session.questions if q.id == question_id), None)
        if not question:
            return False
        
        return user_answer.lower().strip() == question.correct_answer.lower().strip()

    async def _generate_questions(self, config: QuizConfig) -> List[Question]:
        """Generate questions based on configuration"""
        # Sample questions for different topics and difficulties
        sample_questions = {
            QuizTopic.MATH: {
                DifficultyLevel.EASY: [
                    {
                        "question": "What is 2 + 2?",
                        "options": ["3", "4", "5", "6"],
                        "correct_answer": "4",
                        "explanation": "2 + 2 equals 4"
                    },
                    {
                        "question": "What is 5 × 3?",
                        "options": ["12", "15", "18", "20"],
                        "correct_answer": "15",
                        "explanation": "5 multiplied by 3 equals 15"
                    }
                ],
                DifficultyLevel.MEDIUM: [
                    {
                        "question": "What is the square root of 64?",
                        "options": ["6", "7", "8", "9"],
                        "correct_answer": "8",
                        "explanation": "8 × 8 = 64, so √64 = 8"
                    }
                ],
                DifficultyLevel.HARD: [
                    {
                        "question": "What is the derivative of x²?",
                        "options": ["x", "2x", "x²", "2x²"],
                        "correct_answer": "2x",
                        "explanation": "The derivative of x² is 2x using the power rule"
                    }
                ]
            },
            QuizTopic.SCIENCE: {
                DifficultyLevel.EASY: [
                    {
                        "question": "What is the chemical symbol for water?",
                        "options": ["H2O", "CO2", "O2", "H2"],
                        "correct_answer": "H2O",
                        "explanation": "Water consists of 2 hydrogen atoms and 1 oxygen atom"
                    }
                ],
                DifficultyLevel.MEDIUM: [
                    {
                        "question": "What is the speed of light in vacuum?",
                        "options": ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
                        "correct_answer": "300,000 km/s",
                        "explanation": "Light travels at approximately 300,000 kilometers per second in vacuum"
                    }
                ]
            }
        }
        
        questions = []
        topic_questions = sample_questions.get(config.topic, {})
        difficulty_questions = topic_questions.get(config.difficulty, [])
        
        # Generate the requested number of questions
        for i in range(min(config.num_questions, len(difficulty_questions))):
            q_data = difficulty_questions[i % len(difficulty_questions)]
            question = Question(
                id=str(uuid.uuid4()),
                question=q_data["question"],
                options=q_data["options"],
                correct_answer=q_data["correct_answer"],
                explanation=q_data.get("explanation"),
                difficulty=config.difficulty,
                topic=config.topic,
                time_limit=config.time_per_question
            )
            questions.append(question)
        
        return questions


class PerformanceService:
    def __init__(self):
        # In-memory storage for demo (replace with database in production)
        self.user_performance: Dict[str, Dict] = {}

    async def get_user_analytics(self, user_id: str):
        """Get comprehensive user performance analytics"""
        from app.models.quiz import PerformanceAnalytics
        
        # Mock analytics data
        analytics = PerformanceAnalytics(
            user_id=user_id,
            total_quizzes=10,
            accuracy_by_topic={
                "math": 85.5,
                "science": 78.2,
                "history": 92.1
            },
            accuracy_by_difficulty={
                "easy": 95.0,
                "medium": 82.5,
                "hard": 65.0
            },
            average_time_by_topic={
                "math": 25.5,
                "science": 32.1,
                "history": 28.7
            },
            improvement_trend={
                "math": [70, 75, 80, 85],
                "science": [65, 70, 75, 78],
                "history": [85, 88, 90, 92]
            },
            quiz_frequency={
                "2024-01": 3,
                "2024-02": 4,
                "2024-03": 3
            }
        )
        
        return analytics

    async def generate_ai_feedback(self, user_id: str):
        """Generate AI-powered feedback and recommendations"""
        from app.models.quiz import AIFeedback
        
        # Mock AI feedback
        feedback = AIFeedback(
            user_id=user_id,
            weak_topics=[QuizTopic.SCIENCE, QuizTopic.TECHNOLOGY],
            strong_topics=[QuizTopic.HISTORY, QuizTopic.LITERATURE],
            recommended_difficulty=DifficultyLevel.MEDIUM,
            suggested_topics=[QuizTopic.SCIENCE, QuizTopic.MATH],
            improvement_suggestions=[
                "Focus more on science fundamentals",
                "Practice more medium-level math problems",
                "Review technology concepts regularly"
            ]
        )
        
        return feedback

    async def suggest_difficulty(self, user_id: str, topic: QuizTopic) -> DifficultyLevel:
        """Suggest appropriate difficulty level based on user performance"""
        # Mock logic - in reality, this would analyze user's historical performance
        analytics = await self.get_user_analytics(user_id)
        
        topic_accuracy = analytics.accuracy_by_topic.get(topic.value, 50.0)
        
        if topic_accuracy >= 90:
            return DifficultyLevel.HARD
        elif topic_accuracy >= 75:
            return DifficultyLevel.MEDIUM
        else:
            return DifficultyLevel.EASY
