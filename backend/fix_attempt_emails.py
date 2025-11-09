import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB connection
MONGO_URI = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URI)
db = client.quizzify_db

async def fix_attempt_emails():
    """
    Interactive script to update student emails in quiz attempts
    Use this to fix old attempts that used different emails
    """
    
    print("=" * 70)
    print("🔧 FIX ATTEMPT EMAILS")
    print("=" * 70)
    
    # Get all users
    users = await db.users.find({}).to_list(length=None)
    
    print("\n👥 Registered users:")
    for i, user in enumerate(users, 1):
        print(f"{i}. {user['username']} ({user['email']})")
    
    print("\n" + "=" * 70)
    
    # Get all unique student emails from attempts
    attempts = await db.quiz_attempts.find({}).to_list(length=None)
    unique_emails = set(a.get('student_email') for a in attempts)
    
    print(f"\n📧 Found {len(unique_emails)} unique emails in attempts:")
    for email in sorted(unique_emails):
        count = sum(1 for a in attempts if a.get('student_email') == email)
        print(f"   - {email}: {count} attempt(s)")
    
    print("\n" + "=" * 70)
    print("\n⚠️ INSTRUCTIONS:")
    print("1. Identify which test emails belong to which user")
    print("2. Run the update command below for each mapping")
    print("\nExample Python code to update:")
    print("```python")
    print("from motor.motor_asyncio import AsyncIOMotorClient")
    print("client = AsyncIOMotorClient('mongodb://localhost:27017')")
    print("db = client.quizzify_db")
    print("")
    print("# Update all attempts from 'k@gmail.com' to 'krrishvaghani9@gmail.com'")
    print("result = await db.quiz_attempts.update_many(")
    print("    {'student_email': 'k@gmail.com'},")
    print("    {'$set': {'student_email': 'krrishvaghani9@gmail.com'}}")
    print(")")
    print("print(f'Updated {result.modified_count} attempts')")
    print("```")
    
    print("\n" + "=" * 70)
    print("\n💡 RECOMMENDATION:")
    print("Instead of updating old attempts, it's better to:")
    print("1. Take new quizzes while logged in (email auto-fills)")
    print("2. Let old test attempts remain for reference")
    print("3. Focus on new attempts going forward")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(fix_attempt_emails())
