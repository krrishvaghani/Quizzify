from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import os
from datetime import datetime

from app.core.security import get_current_user
from app.models.user import UserDB

router = APIRouter()

# Configure Google Gemini API (you'll need to set GEMINI_API_KEY environment variable)
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class ChatMessage(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    response: str
    suggestions: List[str] = []
    resources: List[Dict[str, str]] = []

class MessageRating(BaseModel):
    message_id: int
    rating: str  # 'positive' or 'negative'

@router.post("/message", response_model=ChatResponse)
async def send_chat_message(
    chat_message: ChatMessage,
    current_user: UserDB = Depends(get_current_user)
) -> ChatResponse:
    """
    Send a message to the AI chatbot and get a response
    """
    try:
        # Build context for the AI
        system_prompt = """You are an AI learning assistant for Quizzify, an educational platform. Your role is to:

1. Help students understand concepts and solve problems
2. Provide clear, educational explanations
3. Give hints without directly providing answers
4. Encourage learning and critical thinking
5. Adapt your explanations to the student's level

Guidelines:
- Be encouraging and supportive
- Break down complex concepts into simple steps
- Use examples and analogies when helpful
- Ask follow-up questions to ensure understanding
- Provide study tips and learning strategies
- Keep responses concise but comprehensive

If the user is working on a specific topic or question, use that context to provide more relevant help."""

        # Build conversation context for Gemini
        conversation_context = system_prompt + "\n\n"
        
        # Add conversation history if available
        if chat_message.context and "conversation_history" in chat_message.context:
            conversation_context += "Previous conversation:\n"
            for msg in chat_message.context["conversation_history"][-3:]:  # Last 3 messages
                if msg.get("type") == "user":
                    conversation_context += f"User: {msg['content']}\n"
                elif msg.get("type") == "bot":
                    conversation_context += f"Assistant: {msg['content']}\n"
            conversation_context += "\n"

        # Add current topic context if available
        if chat_message.context:
            if chat_message.context.get("topic"):
                conversation_context += f"Current topic: {chat_message.context['topic']}\n"
            if chat_message.context.get("question"):
                conversation_context += f"Current question context: {chat_message.context['question']}\n"

        # Combine context with user message
        full_prompt = f"{conversation_context}\nUser: {chat_message.message}\nAssistant:"

        # Get response from Gemini
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if gemini_api_key:
            try:
                model = genai.GenerativeModel('gemini-pro')
                response = model.generate_content(
                    full_prompt,
                    generation_config=genai.types.GenerationConfig(
                        max_output_tokens=500,
                        temperature=0.7,
                    )
                )
                
                ai_response = response.text.strip()
            except Exception as gemini_error:
                print(f"Gemini API error: {gemini_error}")
                ai_response = get_fallback_response(chat_message.message, chat_message.context)
        else:
            # Fallback response when Gemini API key is not available
            ai_response = get_fallback_response(chat_message.message, chat_message.context)

        # Generate suggestions based on the context
        suggestions = generate_suggestions(chat_message.context)
        
        # Generate relevant resources
        resources = generate_resources(chat_message.context)

        return ChatResponse(
            response=ai_response,
            suggestions=suggestions,
            resources=resources
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process chat message: {str(e)}")

@router.post("/rate")
async def rate_message(
    rating: MessageRating,
    current_user: UserDB = Depends(get_current_user)
):
    """
    Rate a chatbot message for feedback
    """
    try:
        # Here you could store the rating in your database for analytics
        # For now, we'll just acknowledge the rating
        return {"message": "Rating recorded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to record rating: {str(e)}")

def get_fallback_response(message: str, context: Optional[Dict[str, Any]] = None) -> str:
    """
    Provide fallback responses when OpenAI API is not available
    """
    message_lower = message.lower()
    
    # Math-related queries
    if any(word in message_lower for word in ['math', 'calculate', 'equation', 'algebra', 'geometry']):
        return """I'd be happy to help with math! Here are some general tips:

1. **Break down the problem**: Identify what you know and what you need to find
2. **Choose the right method**: Think about which mathematical concepts apply
3. **Work step by step**: Don't try to solve everything at once
4. **Check your answer**: Does it make sense in the context?

Could you share the specific math problem you're working on? I can provide more targeted guidance."""

    # Science-related queries
    elif any(word in message_lower for word in ['science', 'physics', 'chemistry', 'biology']):
        return """Science concepts can be tricky, but I'm here to help! Here's my approach:

1. **Understand the fundamentals**: Make sure you grasp the basic principles
2. **Use real-world examples**: Connect concepts to things you see daily
3. **Practice with problems**: Apply the theory to solve actual questions
4. **Draw diagrams**: Visual representations often make concepts clearer

What specific science topic are you studying? I can provide more focused assistance."""

    # Study tips
    elif any(word in message_lower for word in ['study', 'learn', 'tips', 'help']):
        return """Here are some effective learning strategies:

📚 **Active Learning**:
- Summarize concepts in your own words
- Teach the material to someone else
- Create mind maps or diagrams

⏰ **Time Management**:
- Use the Pomodoro Technique (25-min focused sessions)
- Take regular breaks to maintain concentration
- Review material regularly, not just before tests

🎯 **Practice**:
- Work through practice problems
- Take quizzes to test your understanding
- Focus on areas where you struggle most

What subject are you studying? I can give more specific advice!"""

    # General encouragement and help
    else:
        topic_context = ""
        if context and context.get("topic"):
            topic_context = f" I see you're working on {context['topic']} - that's a great subject to master!"

        return f"""I'm here to help you learn and understand concepts better!{topic_context}

I can assist you with:
• 📖 Explaining difficult concepts in simple terms
• 💡 Providing hints and guidance for problems
• 📝 Sharing study strategies and tips
• 🎯 Breaking down complex topics into manageable parts

Feel free to ask me specific questions about what you're studying, or let me know if you'd like help with a particular problem. The more details you provide, the better I can assist you!

What would you like to explore today?"""

def generate_suggestions(context: Optional[Dict[str, Any]] = None) -> List[str]:
    """
    Generate contextual suggestions for the user
    """
    base_suggestions = [
        "Explain this concept step by step",
        "Give me a hint for this problem",
        "Show me similar examples",
        "What are the key points to remember?"
    ]
    
    if context and context.get("topic"):
        topic = context["topic"].lower()
        if "math" in topic:
            return [
                "Help me solve this math problem",
                "Explain the formula I should use",
                "Show me the step-by-step solution",
                "What's a good way to check my answer?"
            ]
        elif "science" in topic:
            return [
                "Explain the scientific concept",
                "Give me a real-world example",
                "What's the underlying principle?",
                "How does this connect to other topics?"
            ]
    
    return base_suggestions

def generate_resources(context: Optional[Dict[str, Any]] = None) -> List[Dict[str, str]]:
    """
    Generate relevant learning resources
    """
    base_resources = [
        {
            "title": "Khan Academy - Free Online Learning",
            "url": "https://www.khanacademy.org"
        },
        {
            "title": "Coursera - Online Courses",
            "url": "https://www.coursera.org"
        }
    ]
    
    if context and context.get("topic"):
        topic = context["topic"].lower()
        if "math" in topic:
            return [
                {
                    "title": "Khan Academy Math",
                    "url": "https://www.khanacademy.org/math"
                },
                {
                    "title": "Wolfram Alpha - Math Solver",
                    "url": "https://www.wolframalpha.com"
                },
                {
                    "title": "PatrickJMT - Math Videos",
                    "url": "https://patrickjmt.com"
                }
            ]
        elif "science" in topic:
            return [
                {
                    "title": "Khan Academy Science",
                    "url": "https://www.khanacademy.org/science"
                },
                {
                    "title": "Crash Course Science",
                    "url": "https://www.youtube.com/user/crashcourse"
                }
            ]
    
    return base_resources
