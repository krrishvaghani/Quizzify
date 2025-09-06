# MongoDB Setup Guide for Quizzify

## Overview
Your Quizzify project has been fully integrated with MongoDB using Beanie (async ODM) and Motor (async MongoDB driver). This guide explains the complete setup and what you'll see in MongoDB Compass.

## Project Structure with MongoDB

```
backend/
├── app/
│   ├── core/
│   │   ├── database.py          # MongoDB connection & configuration
│   │   └── config.py
│   ├── models/
│   │   ├── user.py              # User models with MongoDB Document classes
│   │   └── quiz.py              # Quiz models with MongoDB Document classes
│   ├── repositories/
│   │   ├── user_repository.py   # User data operations
│   │   └── quiz_repository.py   # Quiz data operations
│   ├── services/
│   │   └── quiz_service.py      # Updated to use MongoDB repositories
│   └── main.py                  # FastAPI app with MongoDB lifecycle
└── requirements.txt             # Updated with MongoDB dependencies
```

## MongoDB Dependencies Added

- **motor==3.3.2**: Async MongoDB driver for Python
- **pymongo==4.6.1**: Official MongoDB driver (dependency of motor)
- **beanie==1.24.0**: Async ODM based on Pydantic and Motor

## Database Configuration

### Connection Details
- **Database Name**: `quizzify`
- **Connection URI**: `mongodb://localhost:27017` (default)
- **Environment Variables** (optional):
  - `MONGO_URI`: Custom MongoDB connection string
  - `DATABASE_NAME`: Custom database name

### Collections Created

Your MongoDB database will have 5 main collections:

## 1. **users** Collection
Stores user accounts and statistics.

**Document Structure:**
```json
{
  "_id": ObjectId("..."),
  "email": "user@example.com",
  "password_hash": "hashed_password",
  "stats": {
    "total_quizzes": 0,
    "total_questions": 0,
    "correct_answers": 0,
    "performance_by_topic": {},
    "preferred_topics": [],
    "current_difficulty": "easy"
  },
  "created_at": ISODate("2024-01-01T00:00:00Z")
}
```

**Indexes:**
- `email` (unique)
- `created_at` (descending)

## 2. **quiz_sessions** Collection
Stores active and completed quiz sessions.

**Document Structure:**
```json
{
  "_id": ObjectId("..."),
  "user_id": "user_object_id",
  "config": {
    "topic": "math",
    "difficulty": "medium",
    "num_questions": 5,
    "time_per_question": 30,
    "adaptive_difficulty": true
  },
  "questions": [
    {
      "id": "question_uuid",
      "question": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "correct_answer": "4",
      "explanation": "2 + 2 equals 4",
      "difficulty": "easy",
      "topic": "math",
      "question_type": "multiple_choice",
      "time_limit": 30
    }
  ],
  "current_question_index": 0,
  "answers": {},
  "question_times": {},
  "start_time": ISODate("2024-01-01T10:00:00Z"),
  "end_time": null,
  "score": null,
  "is_completed": false
}
```

**Indexes:**
- `user_id`
- `start_time` (descending)
- `is_completed`

## 3. **quiz_results** Collection
Stores completed quiz results and detailed analytics.

**Document Structure:**
```json
{
  "_id": ObjectId("..."),
  "session_id": "session_object_id",
  "user_id": "user_object_id",
  "topic": "math",
  "difficulty": "medium",
  "total_questions": 5,
  "correct_answers": 4,
  "score_percentage": 80.0,
  "total_time": 120.5,
  "average_time_per_question": 24.1,
  "question_results": [
    {
      "question_id": "question_uuid",
      "question": "What is 2 + 2?",
      "user_answer": "4",
      "correct_answer": "4",
      "is_correct": true,
      "time_taken": 15.2,
      "explanation": "2 + 2 equals 4"
    }
  ],
  "completed_at": ISODate("2024-01-01T10:05:00Z")
}
```

**Indexes:**
- `user_id`
- `completed_at` (descending)
- `topic`
- `difficulty`

## 4. **ai_feedback** Collection
Stores AI-generated feedback and recommendations.

**Document Structure:**
```json
{
  "_id": ObjectId("..."),
  "user_id": "user_object_id",
  "weak_topics": ["science", "technology"],
  "strong_topics": ["history", "literature"],
  "recommended_difficulty": "medium",
  "suggested_topics": ["science", "math"],
  "improvement_suggestions": [
    "Focus more on science fundamentals",
    "Practice more medium-level math problems"
  ],
  "generated_at": ISODate("2024-01-01T10:10:00Z")
}
```

**Indexes:**
- `user_id`
- `generated_at` (descending)

## 5. **performance_analytics** Collection
Stores detailed performance analytics and trends.

**Document Structure:**
```json
{
  "_id": ObjectId("..."),
  "user_id": "user_object_id",
  "total_quizzes": 10,
  "accuracy_by_topic": {
    "math": 85.5,
    "science": 78.2,
    "history": 92.1
  },
  "accuracy_by_difficulty": {
    "easy": 95.0,
    "medium": 82.5,
    "hard": 65.0
  },
  "average_time_by_topic": {
    "math": 25.5,
    "science": 32.1,
    "history": 28.7
  },
  "improvement_trend": {
    "math": [70, 75, 80, 85],
    "science": [65, 70, 75, 78]
  },
  "quiz_frequency": {
    "2024-01": 3,
    "2024-02": 4
  },
  "generated_at": ISODate("2024-01-01T10:15:00Z")
}
```

**Indexes:**
- `user_id`
- `generated_at` (descending)

## What You'll See in MongoDB Compass

### 1. **Database Overview**
- Database name: `quizzify`
- 5 collections as listed above
- Collection sizes and document counts

### 2. **Collection Views**
Each collection will show:
- Document count
- Average document size
- Total collection size
- Index information

### 3. **Document Browser**
You can browse individual documents and see:
- Complete document structure
- Field types (ObjectId, String, Number, Date, etc.)
- Nested objects and arrays
- Index usage statistics

### 4. **Query Interface**
Use Compass to run queries like:
```javascript
// Find all users
db.users.find({})

// Find quiz results for a specific user
db.quiz_results.find({"user_id": "user_object_id"})

// Find active quiz sessions
db.quiz_sessions.find({"is_completed": false})

// Get performance analytics
db.performance_analytics.find({}).sort({"generated_at": -1})
```

### 5. **Aggregation Pipeline**
Create complex analytics queries:
```javascript
// Average score by topic
db.quiz_results.aggregate([
  {$group: {
    _id: "$topic",
    avgScore: {$avg: "$score_percentage"},
    totalQuizzes: {$sum: 1}
  }}
])
```

## Setup Instructions

### 1. Install MongoDB
- Download and install MongoDB Community Server
- Start MongoDB service
- Default runs on `localhost:27017`

### 2. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Run the Application
```bash
cd backend
uvicorn app.main:app --reload
```

### 4. Verify Connection
- Visit `http://localhost:8000/api/health`
- Should show: `{"status": "ok", "database": "connected"}`

### 5. Open MongoDB Compass
- Connect to `mongodb://localhost:27017`
- You'll see the `quizzify` database appear after first API call
- Collections will be created automatically when first documents are inserted

## Key Features

### Automatic Schema Validation
Beanie ensures all documents match your Pydantic models.

### Async Operations
All database operations are non-blocking for better performance.

### Automatic Indexing
Indexes are created automatically based on model definitions.

### Type Safety
Full type hints and validation throughout the application.

### Easy Querying
Use Beanie's query interface or raw MongoDB queries.

## Migration from File Storage

Your old JSON file storage in `app/data/users.json` is now replaced with MongoDB. The new system provides:

- **Scalability**: Handle thousands of users and quiz sessions
- **Performance**: Indexed queries for fast data retrieval
- **Reliability**: ACID transactions and data consistency
- **Analytics**: Complex aggregation queries for insights
- **Concurrent Access**: Multiple users can access simultaneously

## Next Steps

1. **Test the API**: Use the FastAPI docs at `http://localhost:8000/docs`
2. **Monitor in Compass**: Watch data being created in real-time
3. **Create Sample Data**: Register users and take quizzes to see collections populate
4. **Analyze Performance**: Use Compass's performance monitoring tools
5. **Backup Strategy**: Set up regular MongoDB backups for production

Your Quizzify application is now fully integrated with MongoDB and ready for production use!
