import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { quizAPI } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  BookOpen,
  Play,
  RotateCcw,
  Award,
  XCircle,
  ArrowLeft,
  Share2,
  BarChart3,
} from 'lucide-react'

export default function TakeQuizPublic() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  
  // Get room settings if coming from a room
  const roomSettings = location.state?.roomSettings
  const roomId = location.state?.roomId
  
  // Quiz data
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Student info - pre-fill with logged-in user info if available
  const [studentInfo, setStudentInfo] = useState({ 
    name: user?.username || '', 
    email: user?.email || '' 
  })
  const [hasStarted, setHasStarted] = useState(false)
  
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const [questionTimeLeft, setQuestionTimeLeft] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  
  // Time tracking per question
  const [timePerQuestion, setTimePerQuestion] = useState({})
  const [questionStartTime, setQuestionStartTime] = useState(null)
  
  // Resume functionality
  const storageKey = `quiz_${quizId}_progress`

  // Shuffle function for arrays
  const shuffleArray = (array) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  // Update student info when user logs in
  useEffect(() => {
    if (user && !hasStarted) {
      setStudentInfo({
        name: user.username || '',
        email: user.email || ''
      })
    }
  }, [user, hasStarted])

  // Load quiz data
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const data = await quizAPI.getPublicQuiz(quizId)
        let loadedQuiz = data.quiz
        
        // ALWAYS apply shuffling and timer for every attempt
        if (loadedQuiz && loadedQuiz.questions) {
          // ALWAYS shuffle options to prevent Option A from always being correct
          loadedQuiz.questions = loadedQuiz.questions.map(question => ({
            ...question,
            options: shuffleArray(question.options)
          }))
          
          // ALWAYS shuffle questions for variety
          loadedQuiz.questions = shuffleArray(loadedQuiz.questions)
          
          // ALWAYS apply 30-second timer per question (or use room settings if available)
          const timerDuration = roomSettings?.timer_duration || 30
          loadedQuiz.timer_settings = {
            enabled: true,
            timer_type: 'per_question',
            per_question_duration: timerDuration,
            auto_submit: true,
            show_timer: true  // Always show the timer
          }
        }
        
        setQuiz(loadedQuiz)
        
        // Check for saved progress
        const savedProgress = localStorage.getItem(storageKey)
        if (savedProgress) {
          const parsed = JSON.parse(savedProgress)
          // Use logged-in user info if available, otherwise use saved info
          if (user) {
            setStudentInfo({
              name: user.username || parsed.studentInfo?.name || '',
              email: user.email || parsed.studentInfo?.email || ''
            })
          } else {
            setStudentInfo(parsed.studentInfo || { name: '', email: '' })
          }
          setAnswers(parsed.answers || {})
          setCurrentQuestion(parsed.currentQuestion || 0)
          setHasStarted(parsed.hasStarted || false)
          if (parsed.hasStarted && parsed.timeLeft) {
            setTimeLeft(parsed.timeLeft)
          }
          if (parsed.hasStarted && parsed.questionTimeLeft) {
            setQuestionTimeLeft(parsed.questionTimeLeft)
          }
        }
      } catch (err) {
        setError('Failed to load quiz. Please check the link and try again.')
      } finally {
        setLoading(false)
      }
    }

    if (quizId) {
      loadQuiz()
    }
  }, [quizId, storageKey, user])

  // Global timer effect
  useEffect(() => {
    const timerSettings = quiz?.timer_settings
    const isGlobalTimer = timerSettings?.enabled && timerSettings?.timer_type === 'global'
    
    if (timeLeft > 0 && hasStarted && !isSubmitted && isGlobalTimer) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1
          if (newTime <= 0) {
            if (timerSettings?.auto_submit) {
              handleSubmit()
            }
            return 0
          }
          // Save progress every 5 seconds
          if (newTime % 5 === 0) {
            saveProgress(newTime)
          }
          return newTime
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [timeLeft, hasStarted, isSubmitted, quiz])

  // Per-question timer effect
  useEffect(() => {
    const timerSettings = quiz?.timer_settings
    const isPerQuestionTimer = timerSettings?.enabled && timerSettings?.timer_type === 'per_question'
    
    if (questionTimeLeft > 0 && hasStarted && !isSubmitted && isPerQuestionTimer) {
      const timer = setInterval(() => {
        setQuestionTimeLeft(prev => {
          const newTime = prev - 1
          if (newTime <= 0) {
            // Auto-move to next question when time expires
            goToNext()
            return timerSettings?.per_question_duration || 30
          }
          return newTime
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [questionTimeLeft, hasStarted, isSubmitted, currentQuestion, quiz])

  // Track time spent on each question
  useEffect(() => {
    if (hasStarted && !isSubmitted) {
      setQuestionStartTime(Date.now())
      
      return () => {
        // Save time spent when leaving question
        if (questionStartTime) {
          const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
          setTimePerQuestion(prev => ({
            ...prev,
            [currentQuestion]: (prev[currentQuestion] || 0) + timeSpent
          }))
        }
      }
    }
  }, [currentQuestion, hasStarted, isSubmitted])

  // Save progress to localStorage
  const saveProgress = useCallback((currentTime = timeLeft, currentQuestionTime = questionTimeLeft) => {
    if (hasStarted) {
      localStorage.setItem(storageKey, JSON.stringify({
        studentInfo,
        answers,
        currentQuestion,
        hasStarted,
        timeLeft: currentTime,
        questionTimeLeft: currentQuestionTime,
        timestamp: Date.now()
      }))
    }
  }, [storageKey, studentInfo, answers, currentQuestion, hasStarted, timeLeft, questionTimeLeft])

  // Start quiz
  const handleStartQuiz = () => {
    if (!studentInfo.name.trim() || !studentInfo.email.trim()) {
      setError('Please enter your name and email')
      return
    }

    setHasStarted(true)
    const timerSettings = quiz?.timer_settings
    
    // Initialize timers based on settings
    if (timerSettings?.enabled) {
      if (timerSettings.timer_type === 'global') {
        setTimeLeft(timerSettings.global_duration || 1800)
        saveProgress(timerSettings.global_duration || 1800, null)
      } else if (timerSettings.timer_type === 'per_question') {
        setQuestionTimeLeft(timerSettings.per_question_duration || 30)
        saveProgress(null, timerSettings.per_question_duration || 30)
      }
    }
    setError('')
    saveProgress(1800)
  }

  // Detect if question has multiple correct answers
  const hasMultipleCorrect = (question) => {
    const correctCount = question.options.filter(opt => opt.is_correct).length
    return correctCount > 1
  }

  // Handle answer selection
  const handleAnswerChange = (optionIndex, isChecked = true) => {
    const question = quiz.questions[currentQuestion]
    const newAnswers = { ...answers }
    const isMultipleChoice = hasMultipleCorrect(question)

    if (isMultipleChoice) {
      // Multiple choice - use checkboxes
      const currentAnswers = newAnswers[currentQuestion] || []
      if (isChecked) {
        // Add option if not already selected
        if (!currentAnswers.includes(optionIndex)) {
          newAnswers[currentQuestion] = [...currentAnswers, optionIndex]
        }
      } else {
        // Remove option
        newAnswers[currentQuestion] = currentAnswers.filter(idx => idx !== optionIndex)
      }
    } else {
      // Single choice - use radio buttons
      newAnswers[currentQuestion] = [optionIndex]
    }

    setAnswers(newAnswers)
    saveProgress()
  }

  // Navigation
  const goToNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      
      // Reset per-question timer if enabled
      const timerSettings = quiz?.timer_settings
      if (timerSettings?.enabled && timerSettings?.timer_type === 'per_question') {
        setQuestionTimeLeft(timerSettings.per_question_duration || 30)
      }
      
      saveProgress()
    } else if (currentQuestion === quiz.questions.length - 1) {
      // Last question - auto submit if per-question timer and time expired
      const timerSettings = quiz?.timer_settings
      if (timerSettings?.enabled && timerSettings?.timer_type === 'per_question' && timerSettings?.auto_submit) {
        handleSubmit()
      }
    }
  }

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      
      // Reset per-question timer if enabled
      const timerSettings = quiz?.timer_settings
      if (timerSettings?.enabled && timerSettings?.timer_type === 'per_question') {
        setQuestionTimeLeft(timerSettings.per_question_duration || 30)
      }
      
      saveProgress()
    }
  }

  // Submit quiz
  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Save time for current question before submitting
      let finalTimePerQuestion = { ...timePerQuestion }
      if (questionStartTime) {
        const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
        finalTimePerQuestion[currentQuestion] = (finalTimePerQuestion[currentQuestion] || 0) + timeSpent
      }
      
      const submission = {
        quiz_id: quizId,
        student_name: studentInfo.name,
        student_email: studentInfo.email,
        answers: answers,
        time_taken: timeLeft !== null ? (1800 - timeLeft) : 0,
        time_per_question: finalTimePerQuestion,
        ...(roomId && { room_id: roomId }) // Include room_id if taking quiz from a room
      }

      console.log('ðŸ“¤ Submitting quiz:', submission)
      const result = await quizAPI.submitQuizPublic(submission)
      console.log('âœ… Quiz submitted successfully:', result)
      
      setResult(result)
      setIsSubmitted(true)
      
      // Clear saved progress
      localStorage.removeItem(storageKey)
    } catch (err) {
      console.error('âŒ Submit error:', err)
      setError('Failed to submit quiz. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Calculate progress
  const progress = quiz ? ((currentQuestion + 1) / quiz.questions.length) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error && !quiz) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Student info form (before starting)
  if (!hasStarted && quiz) {
    return (
      <div className="min-h-screen bg-[#0f1419]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-6 animate-pulse">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              {quiz.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-cyan-400" />
                </div>
                <span className="font-semibold">{quiz.questions.length} Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-400" />
                </div>
                <span className="font-semibold">30 sec per question</span>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-[#1a1f2e] rounded-2xl border-2 border-gray-800 p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Enter Your Information
              </h2>
            </div>
            
            {error && (
              <div className="mb-6 bg-red-500/10 border-2 border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                    {user && <span className="text-xs text-green-400 ml-2">(✓ Auto-filled)</span>}
                  </div>
                </label>
                <input
                  type="text"
                  value={studentInfo.name}
                  onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                  className={`w-full px-4 py-4 bg-[#252b3b] border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                    user 
                      ? 'border-green-500/50 bg-green-500/5 cursor-not-allowed' 
                      : 'border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                  }`}
                  placeholder="Enter your full name"
                  required
                  readOnly={!!user}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                    {user && <span className="text-xs text-green-400 ml-2">(✓ Auto-filled)</span>}
                  </div>
                </label>
                <input
                  type="email"
                  value={studentInfo.email}
                  onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
                  className={`w-full px-4 py-4 bg-[#252b3b] border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                    user 
                      ? 'border-green-500/50 bg-green-500/5 cursor-not-allowed' 
                      : 'border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                  }`}
                  placeholder="Enter your email address"
                  required
                  readOnly={!!user}
                />
              </div>
            </div>

            <button
              onClick={handleStartQuiz}
              className="w-full px-8 py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <Play className="h-6 w-6 group-hover:scale-110 transition-transform" />
              Start Quiz Now
            </button>

            {!user && (
              <p className="text-center text-gray-400 text-sm mt-4">
                Have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  Log in
                </button>
                {' '}for auto-fill
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Calculate grade based on score
  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+'
    if (percentage >= 80) return 'A'
    if (percentage >= 70) return 'B+'
    if (percentage >= 60) return 'B'
    if (percentage >= 50) return 'C'
    return 'D'
  }

  // Format time in readable format (e.g., "1:30" or "10:45")
  const formatTimeReadable = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Quiz results
  if (isSubmitted && result) {
    const percentage = result.percentage
    const passed = percentage >= 60
    const grade = getGrade(percentage)
    const timeTakenSeconds = result.time_taken || (1800 - (timeLeft || 0))
    const isOnTime = quiz.time_limit ? timeTakenSeconds <= (quiz.time_limit * 60) : true

    return (
      <div className="min-h-screen bg-[#0f1419]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Success Banner with Animation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-2xl backdrop-blur-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-white text-lg">Quiz Completed! 🎉</div>
                <div className="text-green-400 text-sm">Great job on finishing</div>
              </div>
            </div>
          </div>

          {/* Quiz Title */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">
              {quiz.title}
            </h1>
            <p className="text-gray-400 text-lg">Your Results Summary</p>
          </div>

          {/* Score Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {/* Overall Score Card - Spans 2 columns */}
            <div className="md:col-span-2 bg-[#1a1f2e] rounded-2xl border border-gray-800 p-6 relative overflow-hidden">
              {/* Background Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                {/* Circular Progress */}
                <div className="relative w-36 h-36 mb-4">
                  <svg className="w-36 h-36 transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="62"
                      stroke="currentColor"
                      strokeWidth="14"
                      fill="none"
                      className="text-gray-800"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="62"
                      stroke="url(#gradient)"
                      strokeWidth="14"
                      fill="none"
                      strokeDasharray={`${(percentage / 100) * 389} 389`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white">{result.score}</div>
                      <div className="text-xs text-gray-400">of {result.total_questions}</div>
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                  {percentage}%
                </div>
                <div className="text-sm text-gray-400">Overall Score</div>
              </div>
            </div>

            {/* Correct Answers Card */}
            <div className="bg-[#1a1f2e] rounded-2xl border border-gray-800 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/20">
                  <CheckCircle className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-4xl font-bold text-white mb-1">{result.correct_count}</div>
                  <div className="text-sm text-gray-400 mb-1">Correct</div>
                  <div className="text-xs text-green-400">✓ Answers</div>
                </div>
              </div>
            </div>

            {/* Incorrect Answers Card */}
            <div className="bg-[#1a1f2e] rounded-2xl border border-gray-800 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg shadow-red-500/20">
                  <XCircle className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-4xl font-bold text-white mb-1">{result.incorrect_count}</div>
                  <div className="text-sm text-gray-400 mb-1">Incorrect</div>
                  <div className="text-xs text-red-400">✗ Answers</div>
                </div>
              </div>
            </div>

            {/* Time Taken Card */}
            <div className="bg-[#1a1f2e] rounded-2xl border border-gray-800 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg shadow-blue-500/20">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-4xl font-bold text-white mb-1">{formatTimeReadable(timeTakenSeconds)}</div>
                  <div className="text-sm text-gray-400 mb-1">Time Taken</div>
                  <div className="text-xs text-blue-400">
                    {quiz.time_limit ? `⏱ ${quiz.time_limit} min limit` : '∞ No limit'}
                  </div>
                </div>
              </div>
            </div>

            {/* Accuracy Card */}
            <div className="bg-[#1a1f2e] rounded-2xl border border-gray-800 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg shadow-yellow-500/20">
                  <Award className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-4xl font-bold text-white mb-1">{percentage}%</div>
                  <div className="text-sm text-gray-400 mb-1">Accuracy</div>
                  <div className="text-xs text-yellow-400">★ {result.correct_count}/{result.total_questions} correct</div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Analysis */}
          <div className="bg-[#1a1f2e] rounded-2xl border border-gray-800 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Performance Analysis</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* On Time Status */}
              <div className="text-center p-8 bg-[#252b3b] rounded-xl border border-gray-700">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isOnTime 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30' 
                    : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/30'
                }`}>
                  <Clock className="h-10 w-10 text-white" />
                </div>
                <div className={`text-xl font-bold mb-2 ${isOnTime ? 'text-green-400' : 'text-red-400'}`}>
                  {isOnTime ? '✓ On Time' : '✗ Overtime'}
                </div>
                <div className="text-sm text-gray-400">
                  {isOnTime ? 'Completed within limit' : 'Exceeded time limit'}
                </div>
              </div>

              {/* Grade */}
              <div className="text-center p-8 bg-[#252b3b] rounded-xl border border-gray-700">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <div className="text-xl font-bold text-purple-400 mb-2">Grade: {grade}</div>
                <div className="text-sm text-gray-400">Based on your score</div>
              </div>

              {/* Pass/Fail Status */}
              <div className="text-center p-8 bg-[#252b3b] rounded-xl border border-gray-700">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  passed 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30' 
                    : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/30'
                }`}>
                  {passed ? (
                    <CheckCircle className="h-10 w-10 text-white" />
                  ) : (
                    <XCircle className="h-10 w-10 text-white" />
                  )}
                </div>
                <div className={`text-xl font-bold mb-2 ${passed ? 'text-green-400' : 'text-red-400'}`}>
                  {passed ? '✓ Passed' : '✗ Failed'}
                </div>
                <div className="text-sm text-gray-400">
                  {passed ? 'Great job!' : 'Keep practicing!'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            {roomId ? (
              <button
                onClick={() => navigate(`/room/${roomId}`)}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 flex items-center gap-3 group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                Back to Room Lobby
              </button>
            ) : (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 flex items-center gap-3 group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </button>
            )}
            
            <button
              onClick={() => {
                const resultsUrl = `${window.location.origin}/attempt/${result.attempt_id}/review`
                if (navigator.share) {
                  navigator.share({
                    title: `${quiz.title} - Quiz Results`,
                    text: `${quiz.title} - Score: ${percentage}%`,
                    url: resultsUrl
                  })
                } else {
                  navigator.clipboard.writeText(resultsUrl)
                  alert('Results link copied to clipboard!')
                }
              }}
              className="px-8 py-4 bg-[#1a1f2e] text-white rounded-xl font-semibold hover:bg-[#252b3b] border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 flex items-center gap-3 group"
            >
              <Share2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              Share Results
            </button>

            <button
              onClick={() => navigate(`/attempt/${result.attempt_id}/review`)}
              className="px-8 py-4 bg-[#1a1f2e] text-white border border-gray-700 rounded-xl font-semibold hover:bg-[#252b3b] hover:border-purple-500/50 transition-all duration-300 flex items-center gap-3 group"
            >
              <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform" />
              View Detailed Review
            </button>
          </div>

          {/* Motivational Message */}
          <div className="mt-8 text-center">
            {percentage >= 80 && (
              <div className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-2xl inline-block backdrop-blur-sm">
                <p className="text-green-400 font-semibold text-lg">🎉 Excellent work! You've demonstrated strong understanding.</p>
              </div>
            )}
            {percentage >= 60 && percentage < 80 && (
              <div className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-2xl inline-block backdrop-blur-sm">
                <p className="text-yellow-400 font-semibold text-lg">👍 Good job! There's room for improvement.</p>
              </div>
            )}
            {percentage < 60 && (
              <div className="p-6 bg-gradient-to-r from-red-500/10 to-rose-500/10 border-2 border-red-500/30 rounded-2xl inline-block backdrop-blur-sm">
                <p className="text-red-400 font-semibold text-lg">💪 Keep practicing! Review the explanations to improve.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Main quiz interface
  if (hasStarted && quiz && !isSubmitted) {
    const question = quiz.questions[currentQuestion]
    const isLastQuestion = currentQuestion === quiz.questions.length - 1
    const userAnswer = answers[currentQuestion] || []
    const isMultipleChoice = hasMultipleCorrect(question)
    const timerSettings = quiz.timer_settings
    const completionPercentage = ((currentQuestion + 1) / quiz.questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header with Logo and Timer */}
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">QUIZIFY</span>
              </div>
              
              {/* Timer */}
              <div className="flex items-center gap-4">
                {timerSettings?.enabled && timerSettings?.show_timer && timerSettings?.timer_type === 'global' && timeLeft !== null && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    timeLeft < 300 ? 'bg-red-500/20 text-red-300 animate-pulse' : 'bg-slate-700/50 text-slate-300'
                  }`}>
                    <Clock className="h-5 w-5" />
                    <span className="font-mono font-semibold text-lg">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                )}
                
                {timerSettings?.enabled && timerSettings?.show_timer && timerSettings?.timer_type === 'per_question' && questionTimeLeft !== null && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    questionTimeLeft < 10 ? 'bg-red-500/20 text-red-300 animate-pulse' : 'bg-slate-700/50 text-slate-300'
                  }`}>
                    <Clock className="h-5 w-5" />
                    <span className="font-mono font-semibold text-lg">
                      {questionTimeLeft}s
                    </span>
                  </div>
                )}
                
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Quiz Title */}
          <h1 className="text-4xl font-bold text-center text-white mb-8">
            {quiz.title}
          </h1>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-slate-400">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
              <span className="text-sm text-white font-semibold">
                {Math.round(completionPercentage)}% Complete
              </span>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 mb-6">
            {/* Question Number Badge & Text */}
            <div className="mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-white">{currentQuestion + 1}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-white leading-relaxed">
                    {question.question}
                  </h2>
                </div>
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = userAnswer.includes(index)
                const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F']
                
                return (
                  <label
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 border-2 border-cyan-400'
                        : 'bg-slate-700/30 border-2 border-slate-600 hover:bg-slate-700/50 hover:border-slate-500'
                    }`}
                  >
                    {isMultipleChoice ? (
                      // Checkbox for multiple choice
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border-2 ${
                        isSelected 
                          ? 'bg-cyan-500 border-cyan-400' 
                          : 'bg-slate-600/50 border-slate-500'
                      }`}>
                        {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                      </div>
                    ) : (
                      // Radio button styled as badge
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-semibold ${
                        isSelected 
                          ? 'bg-cyan-500 text-white' 
                          : 'bg-slate-600/50 text-slate-300'
                      }`}>
                        {optionLabels[index]}
                      </div>
                    )}
                    <input
                      type={isMultipleChoice ? "checkbox" : "radio"}
                      name={`question_${currentQuestion}`}
                      checked={isSelected}
                      onChange={(e) => {
                        if (isMultipleChoice) {
                          handleAnswerChange(index, e.target.checked)
                        } else {
                          handleAnswerChange(index)
                        }
                      }}
                      className="hidden"
                    />
                    <span className="text-lg text-white flex-1">{option.text}</span>
                  </label>
                )
              })}
            </div>

            {/* Question Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8 pt-6 border-t border-gray-800">
              {quiz.questions.map((_, idx) => {
                const isAnswered = answers[idx] && answers[idx].length > 0
                const isCurrent = idx === currentQuestion
                
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      isCurrent 
                        ? 'bg-cyan-400 w-8' 
                        : isAnswered 
                          ? 'bg-green-500' 
                          : 'bg-slate-600'
                    }`}
                    title={`Question ${idx + 1}${isAnswered ? ' (Answered)' : ''}`}
                  />
                )
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
              <button
                onClick={goToPrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-gray-800 hover:bg-slate-600 text-white font-medium rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/30 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Submit Quiz
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={goToNext}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-red-400">
            <AlertCircle className="h-6 w-6" />
            <span className="font-medium">{error}</span>
          </div>
        )}
      </div>
    )
  }

  return null
}


