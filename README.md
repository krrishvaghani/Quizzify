# 🎯 Quizzify - AI-Powered Quiz Platform

**Quizzify** is a comprehensive quiz generation and management platform that combines the power of AI with intuitive user experience. Teachers can create quizzes from documents using AI or build them manually, while students can take quizzes seamlessly without registration.

## ✨ Features

### 🤖 AI-Powered Quiz Generation
- Upload PDF, DOCX, PPTX, or TXT files
- Generate multiple-choice questions automatically using Google Gemini AI
- Customizable difficulty levels and question counts
- Fallback system ensures reliable quiz generation

### ✍️ Manual Quiz Creation
- Interactive question builder interface
- Support for multiple-choice questions with 4 options
- Add explanations for each question
- Duplicate, edit, and remove questions easily

### 🏫 Multiplayer Room System
- Create quiz rooms with custom settings
- Share room codes for easy joining
- Real-time participant management
- Configurable timer, question shuffling, and attempt limits

### 👨‍🎓 Student-Friendly Experience
- **No registration required** for students
- One-click quiz access via shared links
- Progress tracking with visual indicators
- Auto-save functionality (resume if accidentally closed)
- Countdown timer with warnings
- Instant results and scoring

### 👨‍🏫 Teacher Dashboard
- Comprehensive quiz management
- Room creation and monitoring
- User profile management
- Statistics and analytics
- One-click quiz sharing

## 🚀 Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **MongoDB** - NoSQL database with Motor async driver
- **JWT Authentication** - Secure user authentication
- **Google Gemini AI** - Advanced AI for quiz generation
- **Python Libraries**: PyPDF2, python-pptx, python-docx for file processing

### Frontend
- **React 18** - Modern UI framework with hooks
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **MongoDB** (local or cloud)
- **Google Gemini API Key** (for AI features)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/krrishvaghani/Quizzify.git
cd Quizzify
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Environment Configuration
Create `backend/.env` with:
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=quizzify_db
SECRET_KEY=your-super-secret-key-here
GEMINI_API_KEY=your-google-gemini-api-key
```

## 🚀 Running the Application

### Option 1: Quick Start (Windows)
```bash
# Start both servers
.\setup.ps1
```

### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd backend
.\venv\Scripts\activate
python main.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📖 Usage

### For Teachers:
1. **Register/Login** at http://localhost:3000
2. **Create Quiz**: 
   - Upload documents for AI generation, or
   - Use manual quiz builder
3. **Share Quiz**: Copy the public link from dashboard
4. **Create Rooms**: Set up multiplayer quiz sessions
5. **Monitor**: Track student progress and results

### For Students:
1. **Access Quiz**: Click the shared link (e.g., `/quiz/[id]/start`)
2. **Enter Info**: Provide name and email
3. **Take Quiz**: Answer questions one by one
4. **View Results**: See immediate feedback and scoring

## 🏗️ Project Structure

```
Quizzify/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Environment variables
│   └── venv/               # Virtual environment
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (auth)
│   │   └── utils/          # API utilities
│   ├── package.json        # Node dependencies
│   └── public/            # Static assets
├── .gitignore             # Git ignore rules
├── README.md              # Project documentation
└── setup.ps1             # Quick setup script
```

## 🔌 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user
- `PUT /me` - Update profile
- `PUT /me/password` - Change password

### Quiz Management
- `POST /upload-and-generate` - AI quiz generation
- `POST /quizzes/create-manual` - Manual quiz creation
- `GET /quizzes` - Get user's quizzes
- `GET /quizzes/{id}` - Get specific quiz
- `DELETE /quizzes/{id}` - Delete quiz

### Public Quiz Access
- `GET /public/quiz/{id}` - Get quiz (no auth)
- `POST /public/quiz/submit` - Submit answers (no auth)

### Room Management
- `POST /rooms/create` - Create quiz room
- `GET /rooms` - Get available rooms
- `POST /rooms/join` - Join room
- `POST /rooms/{id}/start` - Start room quiz

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for intelligent quiz generation
- **FastAPI** for the amazing Python web framework
- **React** and **TailwindCSS** for the beautiful UI
- **MongoDB** for flexible data storage

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact: [your-email@example.com]

---

**Made with ❤️ by [Krish Vaghani](https://github.com/krrishvaghani)**

A modern web application that generates multiple-choice questions (MCQs) from uploaded documents using AI. Built with React, TailwindCSS, FastAPI, and MongoDB.

## Features

- 🤖 **AI-Powered Quiz Generation** - Automatically generate MCQs from PDF, PPT, DOCX, and TXT files
- 🔐 **User Authentication** - Secure login and signup with JWT tokens
- 📊 **Dashboard** - View all your generated quizzes with statistics
- 🎯 **Interactive Quiz Interface** - Take quizzes with real-time feedback
- 🎨 **Modern UI** - Beautiful interface built with React and TailwindCSS
- 💾 **MongoDB Storage** - All data stored in local MongoDB database

## Tech Stack

### Frontend
- React 18
- TailwindCSS
- React Router DOM
- Axios
- Lucide React (Icons)
- Vite

### Backend
- FastAPI
- MongoDB (Motor - async driver)
- PyJWT for authentication
- Google Gemini AI (optional)
- PyPDF2, python-pptx, python-docx for file processing

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **MongoDB** (running on localhost:27017)

## Installation

### 1. Clone the Repository

```bash
cd c:\Quizify
```

### 2. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (optional - for Gemini AI)
copy .env.example .env
# Edit .env and add your GEMINI_API_KEY if you want AI generation
```

### 3. Frontend Setup

```powershell
# Navigate to frontend directory
cd ..\frontend

# Install dependencies
npm install
```

### 4. MongoDB Setup

Make sure MongoDB is installed and running on your system:

```powershell
# Start MongoDB service (if not already running)
# On Windows, MongoDB usually runs as a service automatically
# You can check in Services or run:
net start MongoDB
```

## Running the Application

### 1. Start MongoDB

Ensure MongoDB is running on `mongodb://localhost:27017`

### 2. Start Backend Server

```powershell
# In backend directory with virtual environment activated
cd backend
.\venv\Scripts\activate
python main.py
```

Backend will run on: `http://localhost:8000`

### 3. Start Frontend Development Server

```powershell
# In a new terminal, navigate to frontend directory
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:3000`

### 4. Access the Application

Open your browser and go to: `http://localhost:3000`

## Usage

1. **Sign Up**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials
3. **Generate Quiz**: 
   - Click "Generate New Quiz"
   - Upload a document (PDF, PPT, DOCX, or TXT)
   - Select number of questions (3-20)
   - Choose difficulty level (Easy, Medium, Hard)
   - Click "Generate Quiz"
4. **Take Quiz**: View and answer the generated questions
5. **View Results**: See your score and explanations
6. **Manage Quizzes**: View, retake, or delete quizzes from the dashboard

## API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user info

### Quiz Management
- `POST /upload-and-generate` - Upload file and generate quiz
- `GET /quizzes` - Get all user quizzes
- `GET /quizzes/{id}` - Get specific quiz
- `DELETE /quizzes/{id}` - Delete quiz

## File Support

Supported file formats:
- **PDF** (.pdf)
- **PowerPoint** (.ppt, .pptx)
- **Word** (.doc, .docx)
- **Text** (.txt)

## Configuration

### Backend Configuration

Edit `backend/.env` to configure:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=quizzify_db
SECRET_KEY=your-secret-key-change-this-in-production
GEMINI_API_KEY=your-gemini-api-key-here (optional)
```

### Frontend Configuration

Edit `frontend/vite.config.js` to change API proxy settings if needed.

## AI Integration

The application supports Google Gemini AI for better question generation:

1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to `backend/.env`:
   ```
   GEMINI_API_KEY=your-api-key-here
   ```

If no API key is provided, the system will use a fallback method to generate questions.

## Project Structure

```
Quizify/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   └── .env.example           # Environment variables template
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx      # Login page
    │   │   ├── Signup.jsx     # Signup page
    │   │   ├── Dashboard.jsx  # Dashboard page
    │   │   ├── QuizGenerator.jsx  # Quiz generation page
    │   │   └── QuizView.jsx   # Quiz taking page
    │   ├── context/
    │   │   └── AuthContext.jsx  # Authentication context
    │   ├── utils/
    │   │   └── api.js         # API utility functions
    │   ├── App.jsx            # Main app component
    │   ├── main.jsx           # App entry point
    │   └── index.css          # Global styles
    ├── package.json           # NPM dependencies
    ├── vite.config.js         # Vite configuration
    ├── tailwind.config.js     # TailwindCSS configuration
    └── index.html             # HTML template
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `net start MongoDB`
- Check if port 27017 is available
- Verify MongoDB service in Windows Services

### Backend Issues
- Make sure virtual environment is activated
- Install all dependencies: `pip install -r requirements.txt`
- Check Python version: `python --version` (should be 3.9+)

### Frontend Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (should be 18+)
- Clear browser cache and cookies

### Port Conflicts
- Backend (8000): Change port in `backend/main.py`
- Frontend (3000): Change port in `frontend/vite.config.js`

## Security Notes

- Change the `SECRET_KEY` in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Implement rate limiting for API endpoints
- Add input validation and sanitization

## Future Enhancements

- [ ] Support for more file formats (images with OCR)
- [ ] Quiz sharing functionality
- [ ] Leaderboards and scoring history
- [ ] Export quizzes to PDF
- [ ] Multiple quiz formats (True/False, Fill-in-the-blank)
- [ ] Quiz categories and tags
- [ ] Mobile app version

## License

MIT License - feel free to use this project for learning and development.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please create an issue in the repository.

---

**Made with ❤️ by [Krish Vaghani](https://github.com/krrishvaghani)**
