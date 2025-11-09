import asyncio
import sys
sys.path.append('C:/Quizzify/backend')
from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB connection
MONGO_URI = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URI)
db = client.quizzify_db

async def test_my_attempts_endpoint():
    """Test the /my-attempts endpoint logic"""
    
    print("=" * 70)
    print("🔍 TESTING MY-ATTEMPTS ENDPOINT LOGIC")
    print("=" * 70)
    
    # Test for different user emails
    test_emails = [
        "krrishvaghani9@gmail.com",
        "krishvaghani11@gmail.com",
        "k@gmail.com",
        "test@gmail.com"
    ]
    
    for email in test_emails:
        print(f"\n📧 Testing for user: {email}")
        
        # Find all attempts by this user's email
        attempts_cursor = db.quiz_attempts.find({
            "student_email": email
        }).sort("submitted_at", -1)
        
        attempts = await attempts_cursor.to_list(length=100)
        
        print(f"   Found {len(attempts)} attempt(s)")
        
        for i, attempt in enumerate(attempts[:3], 1):
            from bson import ObjectId
            quiz = await db.quizzes.find_one({"_id": ObjectId(attempt["quiz_id"])})
            quiz_title = quiz.get("title", "Unknown Quiz") if quiz else "Unknown Quiz"
            
            print(f"   {i}. {quiz_title}")
            print(f"      Score: {attempt.get('score')}/{attempt.get('total_questions')}")
            print(f"      Submitted: {attempt.get('submitted_at')}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(test_my_attempts_endpoint())
