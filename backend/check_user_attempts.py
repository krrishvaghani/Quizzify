import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime

async def check_specific_attempt():
    # Connect to MongoDB
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.quizzify_db
    
    print("=" * 80)
    print("CHECKING SPECIFIC ATTEMPT FOR EMAIL: krishvaghani11@gmail.com")
    print("=" * 80)
    
    # Get attempts for this user
    attempts = await db.quiz_attempts.find({
        "student_email": "krishvaghani11@gmail.com"
    }).sort("submitted_at", -1).to_list(length=50)
    
    print(f"\nFound {len(attempts)} attempts for krishvaghani11@gmail.com\n")
    
    for i, attempt in enumerate(attempts, 1):
        print(f"\nAttempt #{i}:")
        print(f"  ID: {attempt['_id']}")
        print(f"  Quiz: {attempt.get('quiz_title', 'N/A')}")
        print(f"  Score: {attempt.get('score', 0)}/{attempt.get('total_questions', 0)} ({attempt.get('percentage', 0)}%)")
        print(f"  Time: {attempt.get('submitted_at', 'N/A')}")
        print(f"  Has details: {('question_details' in attempt and len(attempt.get('question_details', [])) > 0)}")
    
    print("\n" + "=" * 80)
    print("CHECKING FOR EMAIL: krrishvaghani9@gmail.com")
    print("=" * 80)
    
    attempts2 = await db.quiz_attempts.find({
        "student_email": "krrishvaghani9@gmail.com"
    }).sort("submitted_at", -1).to_list(length=50)
    
    print(f"\nFound {len(attempts2)} attempts for krrishvaghani9@gmail.com\n")
    
    for i, attempt in enumerate(attempts2, 1):
        print(f"\nAttempt #{i}:")
        print(f"  ID: {attempt['_id']}")
        print(f"  Quiz: {attempt.get('quiz_title', 'N/A')}")
        print(f"  Score: {attempt.get('score', 0)}/{attempt.get('total_questions', 0)} ({attempt.get('percentage', 0)}%)")
        print(f"  Time: {attempt.get('submitted_at', 'N/A')}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_specific_attempt())
