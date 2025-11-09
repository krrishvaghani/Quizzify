from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from datetime import datetime, timedelta
from bson import ObjectId

async def debug_quiz_attempts():
    try:
        client = AsyncIOMotorClient('mongodb://localhost:27017')
        db = client['quizzify_db']
        
        # Get the quiz ID from the screenshot (Quiz from iemh107.pdf)
        print("=" * 70)
        print("🔍 DEBUGGING QUIZ ATTEMPTS")
        print("=" * 70)
        
        # 1. Find all quizzes with this title
        print("\n1️⃣ Finding quiz 'Quiz from iemh107.pdf'...")
        quizzes = await db.quizzes.find({"title": {"$regex": "iemh107", "$options": "i"}}).to_list(length=10)
        
        if not quizzes:
            print("❌ No quiz found with 'iemh107' in title")
            return
        
        print(f"✅ Found {len(quizzes)} quiz(es):")
        for quiz in quizzes:
            quiz_id = str(quiz['_id'])
            print(f"   - Quiz ID: {quiz_id}")
            print(f"     Title: {quiz.get('title')}")
            print(f"     Created by: {quiz.get('created_by', 'Unknown')}")
            print(f"     Questions: {len(quiz.get('questions', []))}")
            print()
        
        # 2. Check attempts for each quiz
        print("\n2️⃣ Checking attempts for each quiz...")
        for quiz in quizzes:
            quiz_id = str(quiz['_id'])
            print(f"\n   Quiz: {quiz.get('title')} (ID: {quiz_id})")
            
            attempts = await db.quiz_attempts.find({"quiz_id": quiz_id}).sort("submitted_at", -1).to_list(length=20)
            
            if not attempts:
                print(f"   ⚠️ No attempts found for this quiz")
            else:
                print(f"   ✅ Found {len(attempts)} attempt(s):")
                for i, attempt in enumerate(attempts, 1):
                    print(f"\n   Attempt #{i}:")
                    print(f"      ID: {attempt.get('_id')}")
                    print(f"      Student: {attempt.get('student_name')} ({attempt.get('student_email')})")
                    print(f"      Score: {attempt.get('score')}/{attempt.get('total_questions')}")
                    print(f"      Percentage: {attempt.get('percentage')}%")
                    print(f"      Time taken: {attempt.get('time_taken')}s")
                    print(f"      Submitted at: {attempt.get('submitted_at')}")
                    print(f"      Answers: {len(attempt.get('answers', {}))} questions answered")
        
        # 3. Check recent attempts (last hour)
        print("\n3️⃣ All attempts in last hour (any quiz)...")
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)
        recent_attempts = await db.quiz_attempts.find({
            "submitted_at": {"$gte": one_hour_ago}
        }).sort("submitted_at", -1).to_list(length=50)
        
        if not recent_attempts:
            print("   ⚠️ No attempts in last hour")
        else:
            print(f"   ✅ Found {len(recent_attempts)} recent attempt(s):")
            for attempt in recent_attempts:
                print(f"      - {attempt.get('quiz_title')} by {attempt.get('student_name')} at {attempt.get('submitted_at')}")
        
        # 4. Total attempts in database
        print("\n4️⃣ Database statistics...")
        total_attempts = await db.quiz_attempts.count_documents({})
        total_quizzes = await db.quizzes.count_documents({})
        print(f"   Total quizzes: {total_quizzes}")
        print(f"   Total attempts: {total_attempts}")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug_quiz_attempts())
