"""
Script to fix old quiz attempts that don't have max_score field.
This adds max_score = total_questions to all old attempts.
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

# MongoDB connection
MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client.quizzify_db  # Use quizzify_db to match main.py

async def fix_old_attempts():
    """Add max_score field to old attempts that don't have it"""
    
    print("🔍 Checking quiz attempts collection...")
    
    # Find all attempts without max_score field
    attempts_without_max_score = await db.quiz_attempts.find(
        {"max_score": {"$exists": False}}
    ).to_list(length=None)
    
    print(f"Found {len(attempts_without_max_score)} attempts without max_score field")
    
    if len(attempts_without_max_score) == 0:
        print("✅ All attempts already have max_score field. Nothing to fix!")
        return
    
    # Update each attempt
    fixed_count = 0
    for attempt in attempts_without_max_score:
        total_questions = attempt.get("total_questions", 0)
        
        # Update with max_score = total_questions
        result = await db.quiz_attempts.update_one(
            {"_id": attempt["_id"]},
            {"$set": {"max_score": total_questions}}
        )
        
        if result.modified_count > 0:
            fixed_count += 1
            print(f"  ✓ Fixed attempt {attempt['_id']} - added max_score={total_questions}")
    
    print(f"\n✅ Fixed {fixed_count} attempts!")
    print(f"   All attempts now have proper max_score field for analytics.")

async def verify_fix():
    """Verify that all attempts now have max_score"""
    
    print("\n🔍 Verifying fix...")
    
    total_attempts = await db.quiz_attempts.count_documents({})
    attempts_with_max_score = await db.quiz_attempts.count_documents(
        {"max_score": {"$exists": True}}
    )
    
    print(f"Total attempts: {total_attempts}")
    print(f"Attempts with max_score: {attempts_with_max_score}")
    
    if total_attempts == attempts_with_max_score:
        print("✅ All attempts have max_score field!")
    else:
        print(f"⚠️  Still missing max_score on {total_attempts - attempts_with_max_score} attempts")
    
    # Show sample of fixed data
    sample = await db.quiz_attempts.find_one({})
    if sample:
        print("\nSample attempt data:")
        print(f"  Quiz: {sample.get('quiz_title', 'N/A')}")
        print(f"  Student: {sample.get('student_name', 'N/A')}")
        print(f"  Score: {sample.get('score', 0)}")
        print(f"  Total Questions: {sample.get('total_questions', 0)}")
        print(f"  Max Score: {sample.get('max_score', 'MISSING')}")
        print(f"  Percentage: {sample.get('percentage', 0)}%")

async def main():
    try:
        await fix_old_attempts()
        await verify_fix()
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    print("=" * 60)
    print("Quiz Attempts Database Fix Script")
    print("=" * 60)
    print()
    
    asyncio.run(main())
