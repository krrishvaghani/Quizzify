import os
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import asyncio

from app.models.user import UserDB
from app.models.quiz import QuizSession, QuizResult, AIFeedback, PerformanceAnalytics


class Database:
    client: Optional[AsyncIOMotorClient] = None
    database = None


db = Database()


async def get_database():
    return db.database


async def connect_to_mongo():
    """Create database connection"""
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    database_name = os.getenv("DATABASE_NAME", "quizzify")
    
    # Create Motor client
    db.client = AsyncIOMotorClient(mongo_uri)
    db.database = db.client[database_name]
    
    # Initialize beanie with the Product document class and a database
    await init_beanie(
        database=db.database,
        document_models=[
            UserDB,
            QuizSession,
            QuizResult,
            AIFeedback,
            PerformanceAnalytics
        ]
    )
    
    print(f"Connected to MongoDB at {mongo_uri}")


async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()
        print("Disconnected from MongoDB")


# Health check function
async def ping_database():
    """Check if database is accessible"""
    try:
        await db.client.admin.command('ping')
        return True
    except Exception as e:
        print(f"Database ping failed: {e}")
        return False
