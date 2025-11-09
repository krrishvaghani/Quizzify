from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from datetime import datetime

async def test_database():
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient('mongodb://localhost:27017')
        db = client['quizzify_db']
        
        # Test connection
        await client.admin.command('ping')
        print("✅ MongoDB connected successfully")
        
        # Test quiz_attempts collection
        count = await db.quiz_attempts.count_documents({})
        print(f"📊 Total quiz attempts in database: {count}")
        
        # Show recent attempts
        attempts = await db.quiz_attempts.find().sort("submitted_at", -1).limit(5).to_list(length=5)
        print(f"\n🔍 Recent {len(attempts)} attempts:")
        for attempt in attempts:
            print(f"  - Quiz: {attempt.get('quiz_title', 'Unknown')}")
            print(f"    Student: {attempt.get('student_name', 'Unknown')}")
            print(f"    Score: {attempt.get('score', 0)}/{attempt.get('total_questions', 0)}")
            print(f"    Submitted: {attempt.get('submitted_at', 'Unknown')}")
            print()
        
        client.close()
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_database())
