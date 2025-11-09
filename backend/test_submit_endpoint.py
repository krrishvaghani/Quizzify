import requests
import json

API_URL = "http://localhost:8000"

# Test quiz submission
quiz_id = "691016e36d6a0c860b4b8aa1"  # The quiz from screenshot

test_submission = {
    "quiz_id": quiz_id,
    "student_name": "Test Student Debug",
    "student_email": "debug@test.com",
    "answers": {
        "0": [0],
        "1": [1], 
        "2": [2],
        "3": [3]
    },
    "time_taken": 120,
    "time_per_question": {
        "0": 30,
        "1": 30,
        "2": 30,
        "3": 30
    }
}

print("=" * 70)
print("🧪 TESTING QUIZ SUBMISSION ENDPOINT")
print("=" * 70)
print(f"\n📤 Submitting test quiz to: {API_URL}/public/quiz/submit")
print(f"Quiz ID: {quiz_id}")
print(f"Payload: {json.dumps(test_submission, indent=2)}\n")

try:
    response = requests.post(
        f"{API_URL}/public/quiz/submit",
        json=test_submission,
        headers={"Content-Type": "application/json"},
        timeout=10
    )
    
    print(f"📥 Response Status: {response.status_code}")
    print(f"📥 Response Headers: {dict(response.headers)}\n")
    
    if response.status_code == 200:
        result = response.json()
        print("✅ SUCCESS! Quiz submitted")
        print(f"Response: {json.dumps(result, indent=2)}")
    else:
        print(f"❌ ERROR: {response.status_code}")
        print(f"Response: {response.text}")
        
except requests.exceptions.ConnectionError:
    print("❌ CONNECTION ERROR: Backend not running on http://localhost:8000")
except requests.exceptions.Timeout:
    print("❌ TIMEOUT: Request took too long")
except Exception as e:
    print(f"❌ ERROR: {str(e)}")
