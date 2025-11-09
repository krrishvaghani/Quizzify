import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime

async def check_attempts():
    # Connect to MongoDB
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.quizzify_db
    
    print("=" * 80)
    print("CHECKING QUIZ ATTEMPTS")
    print("=" * 80)
    
    # Get all attempts
    attempts = await db.quiz_attempts.find().sort("submitted_at", -1).limit(10).to_list(length=10)
    
    print(f"\nFound {len(attempts)} recent attempts\n")
    
    for i, attempt in enumerate(attempts, 1):
        print(f"\n{'='*60}")
        print(f"Attempt #{i}")
        print(f"{'='*60}")
        print(f"ID: {attempt['_id']}")
        print(f"Quiz ID: {attempt.get('quiz_id', 'N/A')}")
        print(f"Quiz Title: {attempt.get('quiz_title', 'N/A')}")
        print(f"Student Name: {attempt.get('student_name', 'N/A')}")
        print(f"Student Email: {attempt.get('student_email', 'N/A')}")
        print(f"Score: {attempt.get('score', 0)}/{attempt.get('total_questions', 0)} ({attempt.get('percentage', 0)}%)")
        print(f"Submitted At: {attempt.get('submitted_at', 'N/A')}")
        
        # Check if question_details exist
        has_question_details = 'question_details' in attempt and len(attempt.get('question_details', [])) > 0
        print(f"\n✓ Has question_details: {has_question_details}")
        
        if has_question_details:
            print(f"  - Number of question details: {len(attempt['question_details'])}")
            # Show first question detail as sample
            first_q = attempt['question_details'][0]
            print(f"  - Sample question: {first_q.get('question', 'N/A')[:50]}...")
            print(f"  - User answered: {first_q.get('is_answered', False)}")
            print(f"  - Was correct: {first_q.get('is_correct', False)}")
        
        # Check if answers exist
        has_answers = 'answers' in attempt and len(attempt.get('answers', {})) > 0
        print(f"✓ Has answers: {has_answers}")
        if has_answers:
            print(f"  - Number of answers: {len(attempt['answers'])}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_attempts())
