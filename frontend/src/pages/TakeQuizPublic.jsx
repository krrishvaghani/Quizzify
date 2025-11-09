import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
  const { user } = useAuth()
  
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
        setQuiz(data.quiz)
        
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
        time_per_question: finalTimePerQuestion
      }

      console.log('📤 Submitting quiz:', submission)
      const result = await quizAPI.submitQuizPublic(submission)
      console.log('✅ Quiz submitted successfully:', result)
      
      setResult(result)
      setIsSubmitted(true)
      
      // Clear saved progress
      localStorage.removeItem(storageKey)
    } catch (err) {
      console.error('❌ Submit error:', err)
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error && !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Found</h2>
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="bg-gray-900 p-4 rounded-lg shadow-lg inline-block mb-4">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              {quiz.title}
            </h1>
            <p className="text-gray-600">
              {quiz.questions.length} questions • Estimated time: 30 minutes
            </p>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Enter Your Information
            </h2>
            
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                    {user && <span className="text-xs text-green-600">(Auto-filled from account)</span>}
                  </div>
                </label>
                <input
                  type="text"
                  value={studentInfo.name}
                  onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                  className={`input-field ${user ? 'bg-green-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter your full name"
                  required
                  readOnly={!!user}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                    {user && <span className="text-xs text-green-600">(Auto-filled from account)</span>}
                  </div>
                </label>
                <input
                  type="email"
                  value={studentInfo.email}
                  onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
                  className={`input-field ${user ? 'bg-green-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter your email address"
                  required
                  readOnly={!!user}
                />
              </div>
            </div>

            <button
              onClick={handleStartQuiz}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <Play className="h-5 w-5" />
              Start Quiz
            </button>
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Success Message */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full border border-green-300">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Quiz Completed Successfully!</span>
            </div>
          </div>

          {/* Quiz Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {quiz.title} <span className="font-normal">Results</span>
            </h1>
            <p className="text-gray-600">Congratulations on completing the quiz!</p>
          </div>

          {/* Score Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Overall Score Card */}
            <div className="card">
              <div className="flex flex-col items-center">
                {/* Circular Progress */}
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#E5E7EB"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(percentage / 100) * 352} 352`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{result.score}</div>
                      <div className="text-sm text-gray-500">out of {result.total_questions}</div>
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1">{percentage}%</div>
                <div className="text-sm text-gray-500">Overall Score</div>
              </div>
            </div>

            {/* Correct Answers Card */}
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{result.correct_count}</div>
                  <div className="text-sm text-gray-600 mb-1">Correct Answers</div>
                  <div className="text-xs text-gray-500">out of {result.total_questions} questions</div>
                </div>
              </div>
            </div>

            {/* Incorrect Answers Card */}
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{result.incorrect_count}</div>
                  <div className="text-sm text-gray-600 mb-1">Incorrect Answers</div>
                  <div className="text-xs text-gray-500">out of {result.total_questions} questions</div>
                </div>
              </div>
            </div>

            {/* Time Taken Card */}
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{formatTimeReadable(timeTakenSeconds)}</div>
                  <div className="text-sm text-gray-600 mb-1">Time Taken</div>
                  <div className="text-xs text-gray-500">
                    {quiz.time_limit ? `Limit: ${quiz.time_limit} minutes` : 'No time limit'}
                  </div>
                </div>
              </div>
            </div>

            {/* Accuracy Card */}
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{percentage}%</div>
                  <div className="text-sm text-gray-600 mb-1">Accuracy</div>
                  <div className="text-xs text-gray-500">{result.correct_count} of {result.total_questions} correct</div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Analysis */}
          <div className="card mb-8">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-gray-700" />
              <h3 className="text-xl font-semibold text-gray-900">Performance Analysis</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* On Time Status */}
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isOnTime ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Clock className={`h-8 w-8 ${isOnTime ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {isOnTime ? 'On Time' : 'Overtime'}
                </div>
                <div className="text-sm text-gray-600">
                  {isOnTime ? 'Completed within time limit' : 'Exceeded time limit'}
                </div>
              </div>

              {/* Grade */}
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">Grade: {grade}</div>
                <div className="text-sm text-gray-600">Based on your score</div>
              </div>

              {/* Pass/Fail Status */}
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  passed ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <CheckCircle className={`h-8 w-8 ${passed ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {passed ? 'Passed' : 'Failed'}
                </div>
                <div className="text-sm text-gray-600">
                  {passed ? 'Great job!' : 'Keep practicing!'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </button>
            
            <button
              onClick={() => {
                const shareText = `I scored ${percentage}% on ${quiz.title}! 🎉`
                if (navigator.share) {
                  navigator.share({
                    title: quiz.title,
                    text: shareText,
                    url: window.location.href
                  })
                } else {
                  navigator.clipboard.writeText(shareText)
                  alert('Results copied to clipboard!')
                }
              }}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-all flex items-center gap-2"
            >
              <Share2 className="h-5 w-5" />
              Share Results
            </button>

            <button
              onClick={() => navigate(`/attempt/${result.attempt_id}/review`)}
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <BookOpen className="h-5 w-5" />
              View Detailed Review
            </button>
          </div>

          {/* Motivational Message */}
          <div className="mt-8 text-center">
            {percentage >= 80 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg inline-block">
                <p className="text-green-800 font-medium">🎉 Excellent work! You've demonstrated strong understanding.</p>
              </div>
            )}
            {percentage >= 60 && percentage < 80 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg inline-block">
                <p className="text-yellow-800 font-medium">👍 Good job! There's room for improvement.</p>
              </div>
            )}
            {percentage < 60 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg inline-block">
                <p className="text-red-800 font-medium">💪 Keep practicing! Review the explanations to improve.</p>
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
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
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
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
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
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8 mb-6">
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
            <div className="flex justify-center gap-2 mt-8 pt-6 border-t border-slate-700">
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
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700">
              <button
                onClick={goToPrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
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
