import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

# MongoDB connection
MONGO_URI = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URI)
db = client.quizzify_db

async def check_all_attempts():
    """Check all attempts in the database"""
    
    print("=" * 70)
    print("🔍 CHECKING ALL QUIZ ATTEMPTS")
    print("=" * 70)
    
    # Get all attempts
    attempts = await db.quiz_attempts.find({}).sort("submitted_at", -1).to_list(length=None)
    
    print(f"\n📊 Total attempts in database: {len(attempts)}\n")
    
    if attempts:
        print("Recent attempts:")
        for i, attempt in enumerate(attempts[:20], 1):
            print(f"\n{i}. Attempt ID: {attempt.get('_id')}")
            print(f"   Quiz ID: {attempt.get('quiz_id')}")
            print(f"   Quiz Title: {attempt.get('quiz_title', 'Unknown')}")
            print(f"   Student: {attempt.get('student_name')} ({attempt.get('student_email')})")
            print(f"   Score: {attempt.get('score')}/{attempt.get('total_questions')}")
            print(f"   Percentage: {attempt.get('percentage')}%")
            print(f"   Submitted at: {attempt.get('submitted_at')}")
    else:
        print("⚠️ No attempts found in database")
    
    # Group by student email
    print("\n" + "=" * 70)
    print("📧 ATTEMPTS BY STUDENT EMAIL")
    print("=" * 70)
    
    email_groups = {}
    for attempt in attempts:
        email = attempt.get('student_email', 'Unknown')
        if email not in email_groups:
            email_groups[email] = []
        email_groups[email].append(attempt)
    
    for email, email_attempts in email_groups.items():
        print(f"\n{email}: {len(email_attempts)} attempt(s)")
        for attempt in email_attempts[:5]:
            print(f"   - {attempt.get('quiz_title', 'Unknown')} (Score: {attempt.get('score')}/{attempt.get('total_questions')})")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_all_attempts())
