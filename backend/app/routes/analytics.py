from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta

from app.core.security import get_current_user
from app.models.user import UserDB
from app.repositories.quiz_repository import QuizRepository
from app.models.quiz import QuizResult

router = APIRouter()


@router.get("/performance-over-time")
async def get_performance_over_time(
    limit: int = 10,
    current_user: UserDB = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get user's performance over time for the last N quizzes"""
    quiz_repo = QuizRepository()
    
    # Get last N quiz results
    results = await quiz_repo.get_quiz_results(str(current_user.id), limit=limit)
    
    if not results:
        return {
            "data": [],
            "trend": "no_data",
            "improvement": 0
        }
    
    # Format data for line chart
    chart_data = []
    for i, result in enumerate(reversed(results)):  # Reverse to show chronological order
        chart_data.append({
            "quiz_number": i + 1,
            "score": result.score_percentage,
            "date": result.completed_at.isoformat(),
            "topic": result.topic.value,
            "difficulty": result.difficulty.value,
            "total_questions": result.total_questions,
            "correct_answers": result.correct_answers
        })
    
    # Calculate trend
    if len(results) >= 2:
        recent_avg = sum(r.score_percentage for r in results[:3]) / min(3, len(results))
        older_avg = sum(r.score_percentage for r in results[-3:]) / min(3, len(results))
        improvement = recent_avg - older_avg
        
        if improvement > 5:
            trend = "improving"
        elif improvement < -5:
            trend = "declining"
        else:
            trend = "stable"
    else:
        trend = "insufficient_data"
        improvement = 0
    
    return {
        "data": chart_data,
        "trend": trend,
        "improvement": round(improvement, 2),
        "total_quizzes": len(results),
        "average_score": round(sum(r.score_percentage for r in results) / len(results), 2)
    }


@router.get("/subject-breakdown")
async def get_subject_breakdown(
    current_user: UserDB = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get user's performance breakdown by subject"""
    quiz_repo = QuizRepository()
    
    # Get all quiz results
    results = await quiz_repo.get_quiz_results(str(current_user.id), limit=100)
    
    if not results:
        return {
            "data": [],
            "strongest_subject": None,
            "weakest_subject": None,
            "total_subjects": 0
        }
    
    # Group by subject
    subject_stats = {}
    for result in results:
        topic = result.topic.value
        if topic not in subject_stats:
            subject_stats[topic] = {
                "total_quizzes": 0,
                "total_score": 0,
                "total_questions": 0,
                "correct_answers": 0,
                "scores": []
            }
        
        subject_stats[topic]["total_quizzes"] += 1
        subject_stats[topic]["total_score"] += result.score_percentage
        subject_stats[topic]["total_questions"] += result.total_questions
        subject_stats[topic]["correct_answers"] += result.correct_answers
        subject_stats[topic]["scores"].append(result.score_percentage)
    
    # Format data for charts
    chart_data = []
    for topic, stats in subject_stats.items():
        avg_score = stats["total_score"] / stats["total_quizzes"]
        accuracy = (stats["correct_answers"] / stats["total_questions"]) * 100
        
        chart_data.append({
            "subject": topic.title(),
            "average_score": round(avg_score, 2),
            "accuracy": round(accuracy, 2),
            "total_quizzes": stats["total_quizzes"],
            "total_questions": stats["total_questions"],
            "correct_answers": stats["correct_answers"],
            "color": get_subject_color(topic)
        })
    
    # Sort by average score
    chart_data.sort(key=lambda x: x["average_score"], reverse=True)
    
    # Find strongest and weakest subjects
    strongest_subject = chart_data[0] if chart_data else None
    weakest_subject = chart_data[-1] if chart_data else None
    
    return {
        "data": chart_data,
        "strongest_subject": strongest_subject,
        "weakest_subject": weakest_subject,
        "total_subjects": len(chart_data)
    }


@router.get("/difficulty-analysis")
async def get_difficulty_analysis(
    current_user: UserDB = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get user's performance analysis by difficulty level"""
    quiz_repo = QuizRepository()
    
    results = await quiz_repo.get_quiz_results(str(current_user.id), limit=100)
    
    if not results:
        return {"data": [], "recommended_difficulty": "easy"}
    
    # Group by difficulty
    difficulty_stats = {}
    for result in results:
        difficulty = result.difficulty.value
        if difficulty not in difficulty_stats:
            difficulty_stats[difficulty] = {
                "total_quizzes": 0,
                "total_score": 0,
                "scores": []
            }
        
        difficulty_stats[difficulty]["total_quizzes"] += 1
        difficulty_stats[difficulty]["total_score"] += result.score_percentage
        difficulty_stats[difficulty]["scores"].append(result.score_percentage)
    
    # Format data
    chart_data = []
    for difficulty, stats in difficulty_stats.items():
        avg_score = stats["total_score"] / stats["total_quizzes"]
        chart_data.append({
            "difficulty": difficulty.title(),
            "average_score": round(avg_score, 2),
            "total_quizzes": stats["total_quizzes"],
            "color": get_difficulty_color(difficulty)
        })
    
    # Recommend next difficulty
    easy_avg = difficulty_stats.get("easy", {}).get("total_score", 0) / max(1, difficulty_stats.get("easy", {}).get("total_quizzes", 1))
    medium_avg = difficulty_stats.get("medium", {}).get("total_score", 0) / max(1, difficulty_stats.get("medium", {}).get("total_quizzes", 1))
    
    if easy_avg >= 85:
        recommended_difficulty = "medium"
    elif medium_avg >= 80:
        recommended_difficulty = "hard"
    else:
        recommended_difficulty = "easy"
    
    return {
        "data": chart_data,
        "recommended_difficulty": recommended_difficulty
    }


@router.get("/recent-activity")
async def get_recent_activity(
    days: int = 30,
    current_user: UserDB = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get user's recent quiz activity"""
    quiz_repo = QuizRepository()
    
    # Get results from last N days
    cutoff_date = datetime.now() - timedelta(days=days)
    results = await quiz_repo.get_quiz_results(str(current_user.id), limit=100)
    
    # Filter by date
    recent_results = [r for r in results if r.completed_at >= cutoff_date]
    
    # Group by date
    daily_activity = {}
    for result in recent_results:
        date_key = result.completed_at.date().isoformat()
        if date_key not in daily_activity:
            daily_activity[date_key] = {
                "date": date_key,
                "quizzes_taken": 0,
                "total_score": 0,
                "questions_answered": 0
            }
        
        daily_activity[date_key]["quizzes_taken"] += 1
        daily_activity[date_key]["total_score"] += result.score_percentage
        daily_activity[date_key]["questions_answered"] += result.total_questions
    
    # Calculate averages
    for day_data in daily_activity.values():
        day_data["average_score"] = round(day_data["total_score"] / day_data["quizzes_taken"], 2)
    
    activity_data = list(daily_activity.values())
    activity_data.sort(key=lambda x: x["date"])
    
    return {
        "data": activity_data,
        "total_days_active": len(activity_data),
        "total_quizzes": len(recent_results),
        "period_days": days
    }


def get_subject_color(subject: str) -> str:
    """Get color for subject visualization"""
    colors = {
        "math": "#3B82F6",      # Blue
        "science": "#10B981",    # Green
        "history": "#F59E0B",    # Yellow
        "literature": "#8B5CF6", # Purple
        "geography": "#EF4444",  # Red
        "technology": "#06B6D4", # Cyan
        "general": "#6B7280"     # Gray
    }
    return colors.get(subject.lower(), "#6B7280")


def get_difficulty_color(difficulty: str) -> str:
    """Get color for difficulty visualization"""
    colors = {
        "easy": "#10B981",    # Green
        "medium": "#F59E0B",  # Yellow
        "hard": "#EF4444"     # Red
    }
    return colors.get(difficulty.lower(), "#6B7280")
