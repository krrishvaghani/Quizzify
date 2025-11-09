"""
Check the current state of the database
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

# MongoDB connection
MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client.quizzify_db  # Use quizzify_db to match main.py

async def check_database():
    """Check all collections and their data"""
    
    print("🔍 Checking database state...\n")
    
    # Check users
    users_count = await db.users.count_documents({})
    print(f"👥 Users: {users_count}")
    
    # Check quizzes
    quizzes_count = await db.quizzes.count_documents({})
    print(f"📝 Quizzes: {quizzes_count}")
    
    if quizzes_count > 0:
        quizzes = await db.quizzes.find({}).to_list(length=5)
        print("\nSample quizzes:")
        for quiz in quizzes:
            print(f"  - {quiz.get('title', 'Untitled')} (ID: {quiz['_id']})")
    
    # Check quiz attempts
    attempts_count = await db.quiz_attempts.count_documents({})
    print(f"\n📊 Quiz Attempts: {attempts_count}")
    
    if attempts_count > 0:
        attempts = await db.quiz_attempts.find({}).to_list(length=5)
        print("\nSample attempts:")
        for attempt in attempts:
            print(f"  - Quiz: {attempt.get('quiz_title', 'N/A')}")
            print(f"    Student: {attempt.get('student_name', 'N/A')} ({attempt.get('student_email', 'N/A')})")
            print(f"    Score: {attempt.get('score', 0)}/{attempt.get('total_questions', '?')}")
            print(f"    Max Score: {attempt.get('max_score', 'MISSING')}")
            print(f"    Percentage: {attempt.get('percentage', 0)}%")
            print()
    
    # Check rooms
    rooms_count = await db.rooms.count_documents({})
    print(f"🏠 Rooms: {rooms_count}")
    
    # List all databases
    databases = await client.list_database_names()
    print(f"\n📚 Available databases: {databases}")

async def main():
    try:
        await check_database()
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    print("=" * 60)
    print("Database Status Check")
    print("=" * 60)
    print()
    
    asyncio.run(main())
