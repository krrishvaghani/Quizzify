from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

async def get_quiz_ids():
    try:
        client = AsyncIOMotorClient('mongodb://localhost:27017')
        db = client['quizzify_db']
        
        print("📚 Available Quizzes:\n")
        
        quizzes = await db.quizzes.find().to_list(length=10)
        
        if not quizzes:
            print("❌ No quizzes found in database!")
            print("Please create a quiz first before testing submissions.")
        else:
            for i, quiz in enumerate(quizzes, 1):
                quiz_id = str(quiz['_id'])
                title = quiz.get('title', 'Untitled')
                num_questions = len(quiz.get('questions', []))
                created_by = quiz.get('created_by', 'Unknown')
                
                print(f"{i}. {title}")
                print(f"   ID: {quiz_id}")
                print(f"   Questions: {num_questions}")
                print(f"   Created by: {created_by}")
                print()
        
        client.close()
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(get_quiz_ids())
