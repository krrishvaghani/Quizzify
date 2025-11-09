import requests
import json
from datetime import datetime

API_URL = "http://localhost:8000"

def test_quiz_submission():
    """Test submitting a quiz and verify it's stored"""
    
    # First, get a quiz to test with
    print("🔍 Fetching available quizzes...")
    try:
        # You'll need to replace this with an actual quiz ID from your database
        # For now, let's try to get quizzes
        quiz_id = input("Enter a quiz ID to test (or press Enter to skip): ").strip()
        
        if not quiz_id:
            print("⚠️ No quiz ID provided. Please get a quiz ID from your database.")
            return
        
        # Prepare test submission
        test_submission = {
            "quiz_id": quiz_id,
            "student_name": "Test Student",
            "student_email": "test@example.com",
            "answers": {
                "0": [0],  # Question 0, selected option 0
                "1": [1],  # Question 1, selected option 1
                "2": [2],  # Question 2, selected option 2
            },
            "time_taken": 300,  # 5 minutes
            "time_per_question": {
                "0": 60,
                "1": 120,
                "2": 120
            }
        }
        
        print(f"\n📤 Submitting test quiz...")
        print(f"Submission data: {json.dumps(test_submission, indent=2)}")
        
        response = requests.post(
            f"{API_URL}/public/quiz/submit",
            json=test_submission,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"\n📥 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Quiz submitted successfully!")
            print(f"Attempt ID: {result.get('attempt_id')}")
            print(f"Score: {result.get('score')}/{result.get('total_questions')}")
            print(f"Percentage: {result.get('percentage')}%")
            
            # Verify in database
            print(f"\n🔍 Verifying attempt was saved...")
            attempt_id = result.get('attempt_id')
            
            verify_response = requests.get(f"{API_URL}/public/attempt/{attempt_id}")
            if verify_response.status_code == 200:
                print(f"✅ Attempt found in database!")
                attempt_data = verify_response.json()
                print(f"   Student: {attempt_data.get('student_name')}")
                print(f"   Email: {attempt_data.get('student_email')}")
                print(f"   Score: {attempt_data.get('score')}")
            else:
                print(f"❌ Could not verify attempt in database")
        else:
            print(f"❌ Error submitting quiz:")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend. Make sure it's running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    print("=" * 60)
    print("Quiz Submission Test")
    print("=" * 60)
    test_quiz_submission()
