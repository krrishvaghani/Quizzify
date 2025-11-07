from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, timedelta
import os
import jwt
from passlib.context import CryptContext
import io
import csv
from pathlib import Path
from dotenv import load_dotenv
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT

# Load environment variables
load_dotenv()

# File processing libraries
from PyPDF2 import PdfReader
from pptx import Presentation
from docx import Document
import google.generativeai as genai

app = FastAPI(title="Quizzify API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "quizzify_db")
client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]

# Security Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Configure Gemini API (you can also use OpenAI or other models)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Models
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class MCQOption(BaseModel):
    text: str
    is_correct: bool

class MCQuestion(BaseModel):
    question: str
    options: List[MCQOption]
    explanation: Optional[str] = None

class QuizGenerate(BaseModel):
    num_questions: int = 5
    difficulty: str = "medium"

class QuizShareSettings(BaseModel):
    visibility: str = "unlisted"  # public, unlisted, password_protected
    password: Optional[str] = None
    allow_anonymous: bool = True

class QuizTimerSettings(BaseModel):
    enabled: bool = False
    timer_type: str = "global"  # global or per_question
    global_duration: int = 1800  # seconds (30 minutes default)
    per_question_duration: int = 30  # seconds per question
    auto_submit: bool = True  # auto-submit when time expires
    show_timer: bool = True  # show countdown timer to students
    
class Quiz(BaseModel):
    id: Optional[str] = None
    title: str
    questions: List[MCQuestion]
    created_by: str
    created_at: datetime
    share_settings: Optional[QuizShareSettings] = None
    timer_settings: Optional[QuizTimerSettings] = None

class RoomSettings(BaseModel):
    enable_timer: bool = False
    timer_duration: int = 60  # seconds per question
    shuffle_questions: bool = False
    shuffle_options: bool = False
    attempts_allowed: int = 1
    show_results_immediately: bool = True

class Room(BaseModel):
    id: Optional[str] = None
    title: str
    description: Optional[str] = None
    quiz_id: str
    host_email: str
    room_code: str
    settings: RoomSettings
    status: str = "waiting"  # waiting, active, completed
    participants: List[str] = []
    max_participants: int = 50
    created_at: datetime
    started_at: Optional[datetime] = None

class CreateRoomRequest(BaseModel):
    quiz_id: str
    title: str
    description: Optional[str] = None
    settings: RoomSettings

class JoinRoomRequest(BaseModel):
    room_code: str

class RoomParticipantScore(BaseModel):
    email: str
    username: str
    score: int
    total_questions: int
    completed_at: Optional[datetime] = None

class UpdateProfile(BaseModel):
    username: str
    full_name: Optional[str] = None

class UpdatePassword(BaseModel):
    current_password: str
    new_password: str

class QuizSubmission(BaseModel):
    quiz_id: str
    student_name: str
    student_email: str
    answers: dict  # {question_index: [selected_option_indices]}
    time_taken: int  # seconds

class QuizAttempt(BaseModel):
    id: Optional[str] = None
    quiz_id: str
    student_name: str
    student_email: str
    answers: dict
    score: int
    total_questions: int
    percentage: float
    time_taken: int
    correct_answers: List[int]  # indices of correct questions
    incorrect_answers: List[int]  # indices of incorrect questions
    unanswered: List[int]  # indices of unanswered questions
    submitted_at: datetime

# Helper Functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def format_time(seconds):
    """Format time in seconds to readable format"""
    minutes = seconds // 60
    remaining_seconds = seconds % 60
    if minutes > 0:
        return f"{minutes} minute{'s' if minutes != 1 else ''} {remaining_seconds} second{'s' if remaining_seconds != 1 else ''}"
    else:
        return f"{remaining_seconds} second{'s' if remaining_seconds != 1 else ''}"

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return user

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    pdf_file = io.BytesIO(file_content)
    pdf_reader = PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def extract_text_from_pptx(file_content: bytes) -> str:
    """Extract text from PowerPoint file"""
    pptx_file = io.BytesIO(file_content)
    prs = Presentation(pptx_file)
    text = ""
    for slide in prs.slides:
        for shape in slide.shapes:
            if hasattr(shape, "text"):
                text += shape.text + "\n"
    return text

def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from Word document"""
    docx_file = io.BytesIO(file_content)
    doc = Document(docx_file)
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text

async def generate_mcqs_with_ai(text: str, num_questions: int, difficulty: str) -> List[dict]:
    """Generate MCQs using AI (Gemini or fallback to simple generation)"""
    
    prompt = f"""
    Based on the following content, generate EXACTLY {num_questions} multiple-choice questions with {difficulty} difficulty level.
    
    IMPORTANT: You must generate exactly {num_questions} questions, no more, no less.
    
    Content:
    {text[:4000]}
    
    Format the response as a JSON array with the following structure:
    [
        {{
            "question": "Question text here?",
            "options": [
                {{"text": "Option A", "is_correct": false}},
                {{"text": "Option B", "is_correct": true}},
                {{"text": "Option C", "is_correct": false}},
                {{"text": "Option D", "is_correct": false}}
            ],
            "explanation": "Why the correct answer is correct"
        }}
    ]
    
    Requirements:
    - Generate EXACTLY {num_questions} questions
    - Each question must have exactly 4 options
    - Only one correct answer per question
    - Return ONLY the JSON array, no additional text
    """
    
    try:
        if GEMINI_API_KEY:
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(prompt)
            
            # Parse the response and extract JSON
            import json
            import re
            response_text = response.text
            
            # Try to find JSON in the response
            json_match = re.search(r'\[[\s\S]*\]', response_text)
            if json_match:
                questions = json.loads(json_match.group())
                
                # If AI generated fewer questions, try to generate more
                if len(questions) < num_questions:
                    print(f"AI generated only {len(questions)} questions, expected {num_questions}")
                    # Add simple questions to fill the gap
                    remaining = num_questions - len(questions)
                    additional = generate_simple_mcqs(text, remaining)
                    questions.extend(additional)
                
                return questions[:num_questions]
    except Exception as e:
        print(f"AI generation error: {e}")
    
    # Fallback: Generate simple questions from the text
    return generate_simple_mcqs(text, num_questions)

def generate_simple_mcqs(text: str, num_questions: int) -> List[dict]:
    """Fallback method to generate simple MCQs"""
    # Split into sentences and filter
    sentences = [s.strip() for s in text.replace('\n', '. ').split('.') if len(s.strip()) > 30]
    
    questions = []
    sentence_index = 0
    
    while len(questions) < num_questions and sentence_index < len(sentences):
        sentence = sentences[sentence_index]
        words = sentence.split()
        
        if len(words) >= 5:
            # Create a fill-in-the-blank question
            blank_index = len(words) // 2
            correct_answer = words[blank_index]
            question_text = ' '.join(words[:blank_index] + ['_____'] + words[blank_index + 1:]) + '?'
            
            # Generate plausible wrong answers
            wrong_answers = [
                f"{correct_answer}s" if not correct_answer.endswith('s') else correct_answer[:-1],
                f"not {correct_answer}",
                "none of these"
            ]
            
            questions.append({
                "question": f"Fill in the blank: {question_text}",
                "options": [
                    {"text": correct_answer, "is_correct": True},
                    {"text": wrong_answers[0], "is_correct": False},
                    {"text": wrong_answers[1], "is_correct": False},
                    {"text": wrong_answers[2], "is_correct": False}
                ],
                "explanation": f"The correct answer is '{correct_answer}' based on the context."
            })
        
        sentence_index += 1
        
        # If we run out of sentences, wrap around with different patterns
        if sentence_index >= len(sentences) and len(questions) < num_questions:
            sentence_index = len(questions)  # Start from where we have questions
            if sentence_index < len(sentences):
                continue
            else:
                # Generate generic questions if we still need more
                for i in range(len(questions), num_questions):
                    questions.append({
                        "question": f"Question {i+1}: Based on the content, what is a key concept?",
                        "options": [
                            {"text": "Concept A", "is_correct": True},
                            {"text": "Concept B", "is_correct": False},
                            {"text": "Concept C", "is_correct": False},
                            {"text": "Concept D", "is_correct": False}
                        ],
                        "explanation": "This is a general question based on the content."
                    })
                break
    
    return questions[:num_questions]

# Routes
@app.get("/")
async def root():
    return {"message": "Quizzify API is running"}

@app.post("/register", response_model=Token)
async def register(user: UserRegister):
    # Check if email already exists
    existing_email = await db.users.find_one({"email": user.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if username already exists
    existing_username = await db.users.find_one({"username": user.username})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    try:
        # Create new user
        hashed_pwd = get_password_hash(user.password)
        print(f"Registration: Creating user {user.email} with hashed password")
        
        user_dict = {
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "hashed_password": hashed_pwd,
            "created_at": datetime.utcnow()
        }
        
        result = await db.users.insert_one(user_dict)
        print(f"Registration successful: User {user.email} created with ID {result.inserted_id}")
        
        # Don't return token anymore since we want users to login manually
        return {"access_token": "", "token_type": "bearer", "message": "Registration successful"}
    except Exception as e:
        print(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail="Registration failed. Please try again.")

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/login", response_model=Token)
async def login_json(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email})
    
    if not user:
        print(f"Login failed: User not found with email {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    password_valid = verify_password(user_data.password, user["hashed_password"])
    print(f"Login attempt for {user_data.email}: Password valid = {password_valid}")
    
    if not password_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "email": current_user["email"],
        "username": current_user["username"],
        "full_name": current_user.get("full_name")
    }

@app.put("/me")
async def update_profile(
    profile_data: UpdateProfile,
    current_user: dict = Depends(get_current_user)
):
    """Update user profile"""
    # Check if username is taken by another user
    existing_user = await db.users.find_one({
        "username": profile_data.username,
        "email": {"$ne": current_user["email"]}
    })
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Update user
    await db.users.update_one(
        {"email": current_user["email"]},
        {"$set": {
            "username": profile_data.username,
            "full_name": profile_data.full_name
        }}
    )
    
    # Get updated user
    updated_user = await db.users.find_one({"email": current_user["email"]})
    
    return {
        "message": "Profile updated successfully",
        "user": {
            "email": updated_user["email"],
            "username": updated_user["username"],
            "full_name": updated_user.get("full_name")
        }
    }

@app.put("/me/password")
async def update_password(
    password_data: UpdatePassword,
    current_user: dict = Depends(get_current_user)
):
    """Update user password"""
    # Verify current password
    if not verify_password(password_data.current_password, current_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect"
        )
    
    # Update password
    new_hashed_password = get_password_hash(password_data.new_password)
    await db.users.update_one(
        {"email": current_user["email"]},
        {"$set": {"hashed_password": new_hashed_password}}
    )
    
    return {"message": "Password updated successfully"}

@app.post("/upload-and-generate")
async def upload_and_generate(
    file: UploadFile = File(...),
    num_questions: int = 5,
    difficulty: str = "medium",
    current_user: dict = Depends(get_current_user)
):
    """Upload a file and generate MCQs"""
    
    # Read file content
    content = await file.read()
    
    # Extract text based on file type
    filename = file.filename.lower()
    
    try:
        if filename.endswith('.pdf'):
            text = extract_text_from_pdf(content)
        elif filename.endswith('.pptx') or filename.endswith('.ppt'):
            text = extract_text_from_pptx(content)
        elif filename.endswith('.docx') or filename.endswith('.doc'):
            text = extract_text_from_docx(content)
        elif filename.endswith('.txt'):
            text = content.decode('utf-8')
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the file")
        
        # Generate MCQs
        questions = await generate_mcqs_with_ai(text, num_questions, difficulty)
        
        # Save quiz to database
        quiz_data = {
            "title": f"Quiz from {file.filename}",
            "questions": questions,
            "created_by": current_user["email"],
            "created_at": datetime.utcnow(),
            "source_file": file.filename
        }
        
        result = await db.quizzes.insert_one(quiz_data)
        quiz_data["id"] = str(result.inserted_id)
        del quiz_data["_id"]  # Remove the ObjectId before returning
        
        return {
            "message": "Quiz generated successfully",
            "quiz": quiz_data,
            "num_questions": len(questions)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.get("/quizzes")
async def get_quizzes(current_user: dict = Depends(get_current_user)):
    """Get all quizzes created by the user"""
    quizzes = await db.quizzes.find({"created_by": current_user["email"]}).to_list(100)
    
    for quiz in quizzes:
        quiz["id"] = str(quiz["_id"])
        del quiz["_id"]
    
    return {"quizzes": quizzes}

@app.get("/quizzes/{quiz_id}")
async def get_quiz(quiz_id: str, current_user: dict = Depends(get_current_user)):
    """Get a specific quiz"""
    from bson import ObjectId
    
    try:
        quiz = await db.quizzes.find_one({"_id": ObjectId(quiz_id)})
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        quiz["id"] = str(quiz["_id"])
        del quiz["_id"]
        
        return quiz
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid quiz ID")

@app.delete("/quizzes/{quiz_id}")
async def delete_quiz(quiz_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a quiz"""
    from bson import ObjectId
    
    try:
        result = await db.quizzes.delete_one({
            "_id": ObjectId(quiz_id),
            "created_by": current_user["email"]
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        return {"message": "Quiz deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid quiz ID")

@app.put("/quizzes/{quiz_id}")
async def update_quiz(quiz_id: str, quiz_data: dict, current_user: dict = Depends(get_current_user)):
    """Update an existing quiz"""
    from bson import ObjectId
    
    try:
        # Verify quiz exists and user owns it
        existing_quiz = await db.quizzes.find_one({
            "_id": ObjectId(quiz_id),
            "created_by": current_user["email"]
        })
        
        if not existing_quiz:
            raise HTTPException(status_code=404, detail="Quiz not found or you don't have permission to edit it")
        
        # Update quiz
        update_data = {
            "title": quiz_data.get("title", existing_quiz["title"]),
            "questions": quiz_data.get("questions", existing_quiz["questions"]),
            "updated_at": datetime.utcnow()
        }
        
        await db.quizzes.update_one(
            {"_id": ObjectId(quiz_id)},
            {"$set": update_data}
        )
        
        return {"message": "Quiz updated successfully", "quiz_id": quiz_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to update quiz: {str(e)}")

class ManualQuizRequest(BaseModel):
    title: str
    questions: List[MCQuestion]

@app.post("/quizzes/create-manual")
async def create_manual_quiz(
    quiz_request: ManualQuizRequest,
    current_user: dict = Depends(get_current_user)
):
    """Create a quiz manually"""
    
    if not quiz_request.title.strip():
        raise HTTPException(status_code=400, detail="Quiz title is required")
    
    if not quiz_request.questions or len(quiz_request.questions) == 0:
        raise HTTPException(status_code=400, detail="At least one question is required")
    
    # Validate questions
    for i, question in enumerate(quiz_request.questions):
        if not question.question.strip():
            raise HTTPException(status_code=400, detail=f"Question {i+1}: Question text is required")
        
        if len(question.options) < 2:
            raise HTTPException(status_code=400, detail=f"Question {i+1}: At least 2 options are required")
        
        correct_count = sum(1 for opt in question.options if opt.is_correct)
        if correct_count != 1:
            raise HTTPException(status_code=400, detail=f"Question {i+1}: Exactly one correct answer is required")
    
    # Save quiz to database
    quiz_data = {
        "title": quiz_request.title,
        "questions": [q.dict() for q in quiz_request.questions],
        "created_by": current_user["email"],
        "created_at": datetime.utcnow(),
        "source": "manual"
    }
    
    result = await db.quizzes.insert_one(quiz_data)
    quiz_data["id"] = str(result.inserted_id)
    del quiz_data["_id"]
    
    return {
        "message": "Quiz created successfully",
        "quiz": quiz_data
    }

# ============= ROOM ENDPOINTS =============

def generate_room_code():
    """Generate a unique 6-character room code"""
    import random
    import string
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

class CreateRoomRequest(BaseModel):
    quiz_id: str
    title: str
    description: Optional[str] = None
    settings: RoomSettings

@app.post("/rooms/create")
async def create_room(
    room_request: CreateRoomRequest,
    current_user: dict = Depends(get_current_user)
):
    """Create a new multiplayer room"""
    from bson import ObjectId
    
    # Verify quiz exists and belongs to user
    try:
        quiz = await db.quizzes.find_one({
            "_id": ObjectId(room_request.quiz_id),
            "created_by": current_user["email"]
        })
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid quiz ID: {str(e)}")
    
    # Generate unique room code
    room_code = generate_room_code()
    while await db.rooms.find_one({"room_code": room_code}):
        room_code = generate_room_code()
    
    # Create room
    room_data = {
        "title": room_request.title,
        "description": room_request.description,
        "quiz_id": room_request.quiz_id,
        "host_email": current_user["email"],
        "room_code": room_code,
        "settings": room_request.settings.dict(),
        "status": "waiting",
        "participants": [current_user["email"]],
        "max_participants": 50,
        "created_at": datetime.utcnow(),
        "started_at": None
    }
    
    result = await db.rooms.insert_one(room_data)
    room_data["id"] = str(result.inserted_id)
    del room_data["_id"]
    
    return {
        "message": "Room created successfully",
        "room": room_data
    }

@app.get("/rooms")
async def get_rooms(current_user: dict = Depends(get_current_user)):
    """Get all available rooms"""
    rooms = await db.rooms.find({"status": {"$in": ["waiting", "active"]}}).to_list(100)
    
    for room in rooms:
        room["id"] = str(room["_id"])
        del room["_id"]
        
        # Get quiz title
        from bson import ObjectId
        quiz = await db.quizzes.find_one({"_id": ObjectId(room["quiz_id"])})
        if quiz:
            room["quiz_title"] = quiz["title"]
        
        # Get host username
        host = await db.users.find_one({"email": room["host_email"]})
        if host:
            room["host_username"] = host["username"]
    
    return {"rooms": rooms}

@app.get("/rooms/my-rooms")
async def get_my_rooms(current_user: dict = Depends(get_current_user)):
    """Get rooms created by the current user"""
    rooms = await db.rooms.find({"host_email": current_user["email"]}).to_list(100)
    
    for room in rooms:
        room["id"] = str(room["_id"])
        del room["_id"]
        
        # Get quiz title
        from bson import ObjectId
        quiz = await db.quizzes.find_one({"_id": ObjectId(room["quiz_id"])})
        if quiz:
            room["quiz_title"] = quiz["title"]
    
    return {"rooms": rooms}

@app.get("/rooms/{room_id}")
async def get_room(room_id: str, current_user: dict = Depends(get_current_user)):
    """Get room details"""
    from bson import ObjectId
    
    try:
        room = await db.rooms.find_one({"_id": ObjectId(room_id)})
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        
        room["id"] = str(room["_id"])
        del room["_id"]
        
        # Get quiz details
        quiz = await db.quizzes.find_one({"_id": ObjectId(room["quiz_id"])})
        if quiz:
            room["quiz"] = {
                "id": str(quiz["_id"]),
                "title": quiz["title"],
                "num_questions": len(quiz.get("questions", []))
            }
        
        # Get participants details
        participants_details = []
        for participant_email in room.get("participants", []):
            user = await db.users.find_one({"email": participant_email})
            if user:
                participants_details.append({
                    "email": participant_email,
                    "username": user["username"],
                    "full_name": user.get("full_name")
                })
        room["participants_details"] = participants_details
        
        return room
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid room ID")

@app.post("/rooms/join")
async def join_room(
    join_request: JoinRoomRequest,
    current_user: dict = Depends(get_current_user)
):
    """Join a room using room code"""
    room = await db.rooms.find_one({"room_code": join_request.room_code})
    
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    if room["status"] == "completed":
        raise HTTPException(status_code=400, detail="Room has already completed")
    
    if len(room["participants"]) >= room["max_participants"]:
        raise HTTPException(status_code=400, detail="Room is full")
    
    # Add user to participants if not already in
    if current_user["email"] not in room["participants"]:
        from bson import ObjectId
        await db.rooms.update_one(
            {"_id": ObjectId(room["_id"])},
            {"$push": {"participants": current_user["email"]}}
        )
    
    room["id"] = str(room["_id"])
    
    return {
        "message": "Joined room successfully",
        "room_id": room["id"],
        "room_code": room["room_code"]
    }

@app.post("/rooms/{room_id}/start")
async def start_room(room_id: str, current_user: dict = Depends(get_current_user)):
    """Start the quiz room (host only)"""
    from bson import ObjectId
    
    try:
        room = await db.rooms.find_one({"_id": ObjectId(room_id)})
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        
        if room["host_email"] != current_user["email"]:
            raise HTTPException(status_code=403, detail="Only the host can start the room")
        
        if room["status"] != "waiting":
            raise HTTPException(status_code=400, detail="Room has already started")
        
        await db.rooms.update_one(
            {"_id": ObjectId(room_id)},
            {
                "$set": {
                    "status": "active",
                    "started_at": datetime.utcnow()
                }
            }
        )
        
        return {"message": "Room started successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid room ID")

@app.post("/rooms/{room_id}/complete")
async def complete_room(room_id: str, current_user: dict = Depends(get_current_user)):
    """Complete the quiz room (host only)"""
    from bson import ObjectId
    
    try:
        room = await db.rooms.find_one({"_id": ObjectId(room_id)})
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        
        if room["host_email"] != current_user["email"]:
            raise HTTPException(status_code=403, detail="Only the host can complete the room")
        
        await db.rooms.update_one(
            {"_id": ObjectId(room_id)},
            {"$set": {"status": "completed"}}
        )
        
        return {"message": "Room deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid room ID")

# Public Quiz Endpoints (No Authentication Required)

@app.get("/public/quiz/{quiz_id}")
async def get_public_quiz(quiz_id: str):
    """Get quiz for public access (no authentication required)"""
    from bson import ObjectId
    
    try:
        quiz = await db.quizzes.find_one({"_id": ObjectId(quiz_id)})
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        # Remove sensitive information
        quiz["id"] = str(quiz["_id"])
        del quiz["_id"]
        del quiz["created_by"]  # Don't expose creator info
        
        return {"quiz": quiz}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid quiz ID")

@app.post("/public/quiz/submit")
async def submit_quiz_public(submission: QuizSubmission):
    """Submit quiz answers with detailed scoring (no authentication required)"""
    from bson import ObjectId
    
    try:
        # Get the quiz
        quiz = await db.quizzes.find_one({"_id": ObjectId(submission.quiz_id)})
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        # Detailed scoring analysis
        score = 0
        total_questions = len(quiz["questions"])
        correct_answers = []
        incorrect_answers = []
        unanswered = []
        question_details = []
        
        for question_index, question in enumerate(quiz["questions"]):
            user_answers = submission.answers.get(str(question_index), [])
            
            # Find correct answer indices
            correct_indices = []
            for option_index, option in enumerate(question["options"]):
                if option["is_correct"]:
                    correct_indices.append(option_index)
            
            # Determine if answer is correct
            is_correct = set(user_answers) == set(correct_indices) if user_answers else False
            is_answered = len(user_answers) > 0
            
            if not is_answered:
                unanswered.append(question_index)
            elif is_correct:
                correct_answers.append(question_index)
                score += 1
            else:
                incorrect_answers.append(question_index)
            
            # Store question details for review
            question_details.append({
                "question_index": question_index,
                "question": question["question"],
                "options": [opt["text"] for opt in question["options"]],
                "correct_indices": correct_indices,
                "user_answers": user_answers,
                "is_correct": is_correct,
                "is_answered": is_answered,
                "explanation": question.get("explanation", "")
            })
        
        percentage = round((score / total_questions) * 100, 1)
        
        # Save detailed attempt to database
        attempt_data = {
            "quiz_id": submission.quiz_id,
            "quiz_title": quiz["title"],
            "student_name": submission.student_name,
            "student_email": submission.student_email,
            "answers": submission.answers,
            "score": score,
            "total_questions": total_questions,
            "percentage": percentage,
            "time_taken": submission.time_taken,
            "correct_answers": correct_answers,
            "incorrect_answers": incorrect_answers,
            "unanswered": unanswered,
            "question_details": question_details,
            "submitted_at": datetime.utcnow()
        }
        
        result = await db.quiz_attempts.insert_one(attempt_data)
        attempt_id = str(result.inserted_id)
        
        return {
            "message": "Quiz submitted successfully",
            "attempt_id": attempt_id,
            "score": score,
            "total_questions": total_questions,
            "percentage": percentage,
            "time_taken": submission.time_taken,
            "correct_count": len(correct_answers),
            "incorrect_count": len(incorrect_answers),
            "unanswered_count": len(unanswered),
            "time_formatted": format_time(submission.time_taken)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting quiz: {str(e)}")

@app.get("/public/attempt/{attempt_id}")
async def get_attempt_details(attempt_id: str):
    """Get detailed attempt results for answer review (no authentication required)"""
    from bson import ObjectId
    
    try:
        attempt = await db.quiz_attempts.find_one({"_id": ObjectId(attempt_id)})
        if not attempt:
            raise HTTPException(status_code=404, detail="Attempt not found")
        
        # Format the response
        attempt["id"] = str(attempt["_id"])
        del attempt["_id"]
        
        return {
            "attempt": attempt
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid attempt ID")

@app.delete("/rooms/{room_id}")
async def delete_room(room_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a room (host only)"""
    from bson import ObjectId
    
    try:
        result = await db.rooms.delete_one({
            "_id": ObjectId(room_id),
            "host_email": current_user["email"]
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Room not found")
        
        return {"message": "Room deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid room ID")

# ==================== Export/Share Endpoints ====================

@app.get("/quizzes/{quiz_id}/attempts")
async def get_quiz_attempts(quiz_id: str, current_user: dict = Depends(get_current_user)):
    """Get all attempts for a quiz (teacher only)"""
    from bson import ObjectId
    
    try:
        # Verify quiz ownership
        quiz = await db.quizzes.find_one({
            "_id": ObjectId(quiz_id),
            "created_by": current_user["email"]
        })
        
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found or unauthorized")
        
        # Get all attempts for this quiz
        attempts_cursor = db.quiz_attempts.find({"quiz_id": quiz_id}).sort("submitted_at", -1)
        attempts = await attempts_cursor.to_list(length=None)
        
        # Format attempts
        formatted_attempts = []
        for attempt in attempts:
            formatted_attempts.append({
                "id": str(attempt["_id"]),
                "student_name": attempt.get("student_name", "Unknown"),
                "student_email": attempt.get("student_email", "N/A"),
                "score": attempt.get("score", 0),
                "total_questions": attempt.get("total_questions", 0),
                "percentage": attempt.get("percentage", 0),
                "time_taken": attempt.get("time_taken", 0),
                "submitted_at": attempt.get("submitted_at").isoformat() if attempt.get("submitted_at") else None
            })
        
        return {
            "quiz_id": quiz_id,
            "quiz_title": quiz.get("title", "Untitled Quiz"),
            "total_attempts": len(formatted_attempts),
            "attempts": formatted_attempts
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching attempts: {str(e)}")

@app.get("/quizzes/{quiz_id}/export/csv")
async def export_quiz_csv(quiz_id: str, current_user: dict = Depends(get_current_user)):
    """Export quiz attempts as CSV"""
    from bson import ObjectId
    
    try:
        # Verify quiz ownership
        quiz = await db.quizzes.find_one({
            "_id": ObjectId(quiz_id),
            "created_by": current_user["email"]
        })
        
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found or unauthorized")
        
        # Get all attempts
        attempts_cursor = db.quiz_attempts.find({"quiz_id": quiz_id}).sort("submitted_at", -1)
        attempts = await attempts_cursor.to_list(length=None)
        
        # Create CSV in memory
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            "Student Name",
            "Email",
            "Score",
            "Total Questions",
            "Percentage",
            "Time Taken (seconds)",
            "Time Taken (formatted)",
            "Submitted At"
        ])
        
        # Write data
        for attempt in attempts:
            time_taken = attempt.get("time_taken", 0)
            minutes = time_taken // 60
            seconds = time_taken % 60
            time_formatted = f"{minutes}m {seconds}s"
            
            writer.writerow([
                attempt.get("student_name", "Unknown"),
                attempt.get("student_email", "N/A"),
                attempt.get("score", 0),
                attempt.get("total_questions", 0),
                f"{attempt.get('percentage', 0):.1f}%",
                time_taken,
                time_formatted,
                attempt.get("submitted_at").strftime("%Y-%m-%d %H:%M:%S") if attempt.get("submitted_at") else "N/A"
            ])
        
        # Prepare response
        output.seek(0)
        filename = f"{quiz.get('title', 'quiz').replace(' ', '_')}_attempts.csv"
        
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error exporting CSV: {str(e)}")

@app.get("/quizzes/{quiz_id}/export/pdf")
async def export_quiz_pdf(quiz_id: str, current_user: dict = Depends(get_current_user)):
    """Export quiz with answers as PDF (for printing)"""
    from bson import ObjectId
    
    try:
        # Verify quiz ownership
        quiz = await db.quizzes.find_one({
            "_id": ObjectId(quiz_id),
            "created_by": current_user["email"]
        })
        
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found or unauthorized")
        
        # Create PDF in memory
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.75*inch, bottomMargin=0.75*inch)
        story = []
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#4F46E5'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        question_style = ParagraphStyle(
            'Question',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#1F2937'),
            spaceAfter=12,
            spaceBefore=20
        )
        
        option_style = ParagraphStyle(
            'Option',
            parent=styles['Normal'],
            fontSize=11,
            leftIndent=20,
            spaceAfter=6
        )
        
        correct_style = ParagraphStyle(
            'Correct',
            parent=styles['Normal'],
            fontSize=11,
            leftIndent=20,
            textColor=colors.HexColor('#10B981'),
            spaceAfter=6
        )
        
        explanation_style = ParagraphStyle(
            'Explanation',
            parent=styles['Normal'],
            fontSize=10,
            leftIndent=20,
            textColor=colors.HexColor('#6B7280'),
            spaceAfter=12,
            fontName='Helvetica-Oblique'
        )
        
        # Add title
        story.append(Paragraph(quiz.get("title", "Quiz"), title_style))
        story.append(Paragraph(f"Created: {quiz.get('created_at', datetime.now()).strftime('%B %d, %Y')}", styles['Normal']))
        story.append(Paragraph(f"Total Questions: {len(quiz.get('questions', []))}", styles['Normal']))
        story.append(Spacer(1, 0.3*inch))
        
        # Add questions
        for idx, question in enumerate(quiz.get("questions", []), 1):
            # Question text
            story.append(Paragraph(f"<b>Question {idx}:</b> {question.get('question', '')}", question_style))
            
            # Options
            for opt_idx, option in enumerate(question.get("options", []), 1):
                option_text = option.get("text", "")
                is_correct = option.get("is_correct", False)
                
                if is_correct:
                    story.append(Paragraph(f"<b>{chr(64+opt_idx)}. {option_text} ✓</b>", correct_style))
                else:
                    story.append(Paragraph(f"{chr(64+opt_idx)}. {option_text}", option_style))
            
            # Explanation
            if question.get("explanation"):
                story.append(Spacer(1, 0.1*inch))
                story.append(Paragraph(f"<b>Explanation:</b> {question.get('explanation')}", explanation_style))
            
            # Add some space between questions
            story.append(Spacer(1, 0.2*inch))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        
        filename = f"{quiz.get('title', 'quiz').replace(' ', '_')}_with_answers.pdf"
        
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error exporting PDF: {str(e)}")

@app.put("/quizzes/{quiz_id}/share-settings")
async def update_share_settings(
    quiz_id: str,
    share_settings: QuizShareSettings,
    current_user: dict = Depends(get_current_user)
):
    """Update quiz sharing settings"""
    from bson import ObjectId
    
    try:
        # Verify quiz ownership
        quiz = await db.quizzes.find_one({
            "_id": ObjectId(quiz_id),
            "created_by": current_user["email"]
        })
        
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found or unauthorized")
        
        # Hash password if provided
        settings_dict = share_settings.dict()
        if settings_dict.get("password"):
            settings_dict["password"] = pwd_context.hash(settings_dict["password"])
        
        # Update quiz
        await db.quizzes.update_one(
            {"_id": ObjectId(quiz_id)},
            {"$set": {"share_settings": settings_dict}}
        )
        
        return {
            "message": "Share settings updated successfully",
            "settings": {
                "visibility": settings_dict["visibility"],
                "allow_anonymous": settings_dict["allow_anonymous"],
                "has_password": bool(settings_dict.get("password"))
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error updating share settings: {str(e)}")

@app.put("/quizzes/{quiz_id}/timer-settings")
async def update_timer_settings(
    quiz_id: str,
    timer_settings: QuizTimerSettings,
    current_user: dict = Depends(get_current_user)
):
    """Update quiz timer settings"""
    from bson import ObjectId
    
    try:
        # Verify quiz ownership
        quiz = await db.quizzes.find_one({
            "_id": ObjectId(quiz_id),
            "created_by": current_user["email"]
        })
        
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found or unauthorized")
        
        settings_dict = timer_settings.dict()
        
        # Update quiz
        await db.quizzes.update_one(
            {"_id": ObjectId(quiz_id)},
            {"$set": {"timer_settings": settings_dict}}
        )
        
        return {
            "message": "Timer settings updated successfully",
            "settings": settings_dict
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error updating timer settings: {str(e)}")


@app.post("/public/quiz/{quiz_id}/verify-access")
async def verify_quiz_access(quiz_id: str, password: Optional[str] = None):
    """Verify access to a password-protected quiz"""
    from bson import ObjectId
    
    try:
        quiz = await db.quizzes.find_one({"_id": ObjectId(quiz_id)})
        
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        share_settings = quiz.get("share_settings", {})
        
        # Check if quiz is password protected
        if share_settings.get("visibility") == "password_protected":
            if not password:
                raise HTTPException(status_code=401, detail="Password required")
            
            stored_password = share_settings.get("password")
            if not stored_password or not verify_password(password, stored_password):
                raise HTTPException(status_code=401, detail="Incorrect password")
        
        return {
            "access_granted": True,
            "message": "Access granted"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error verifying access: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
