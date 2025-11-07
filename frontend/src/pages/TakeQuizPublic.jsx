import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { quizAPI } from '../utils/api'
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
} from 'lucide-react'

export default function TakeQuizPublic() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  
  // Quiz data
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Student info
  const [studentInfo, setStudentInfo] = useState({ name: '', email: '' })
  const [hasStarted, setHasStarted] = useState(false)
  
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  
  // Resume functionality
  const storageKey = `quiz_${quizId}_progress`

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
          setStudentInfo(parsed.studentInfo || { name: '', email: '' })
          setAnswers(parsed.answers || {})
          setCurrentQuestion(parsed.currentQuestion || 0)
          setHasStarted(parsed.hasStarted || false)
          if (parsed.hasStarted && parsed.timeLeft) {
            setTimeLeft(parsed.timeLeft)
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
  }, [quizId, storageKey])

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && hasStarted && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1
          if (newTime <= 0) {
            handleSubmit()
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
  }, [timeLeft, hasStarted, isSubmitted])

  // Save progress to localStorage
  const saveProgress = useCallback((currentTime = timeLeft) => {
    if (hasStarted) {
      localStorage.setItem(storageKey, JSON.stringify({
        studentInfo,
        answers,
        currentQuestion,
        hasStarted,
        timeLeft: currentTime,
        timestamp: Date.now()
      }))
    }
  }, [storageKey, studentInfo, answers, currentQuestion, hasStarted, timeLeft])

  // Start quiz
  const handleStartQuiz = () => {
    if (!studentInfo.name.trim() || !studentInfo.email.trim()) {
      setError('Please enter your name and email')
      return
    }

    setHasStarted(true)
    // Set timer to 30 minutes (1800 seconds) - can be made configurable
    setTimeLeft(1800)
    setError('')
    saveProgress(1800)
  }

  // Handle answer selection
  const handleAnswerChange = (optionIndex, isChecked = true) => {
    const question = quiz.questions[currentQuestion]
    const newAnswers = { ...answers }

    // For now, treating all as single-select (radio buttons)
    // Future enhancement: detect multiple correct answers for checkboxes
    newAnswers[currentQuestion] = [optionIndex]

    setAnswers(newAnswers)
    saveProgress()
  }

  // Navigation
  const goToNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      saveProgress()
    }
  }

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      saveProgress()
    }
  }

  // Submit quiz
  const handleSubmit = async () => {
    try {
      setLoading(true)
      const submission = {
        quiz_id: quizId,
        student_name: studentInfo.name,
        student_email: studentInfo.email,
        answers: answers,
        time_taken: 1800 - timeLeft
      }

      const result = await quizAPI.submitQuizPublic(submission)
      setResult(result)
      setIsSubmitted(true)
      
      // Clear saved progress
      localStorage.removeItem(storageKey)
    } catch (err) {
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error && !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-2xl shadow-lg inline-block mb-4">
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
                  </div>
                </label>
                <input
                  type="text"
                  value={studentInfo.name}
                  onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </div>
                </label>
                <input
                  type="email"
                  value={studentInfo.email}
                  onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
                  className="input-field"
                  placeholder="Enter your email address"
                  required
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

  // Quiz results
  if (isSubmitted && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 rounded-2xl shadow-lg inline-block mb-4">
              <Award className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              Quiz Completed!
            </h1>
            <p className="text-gray-600">
              Thank you for taking the quiz, {studentInfo.name}
            </p>
          </div>

          <div className="card mb-6">
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-purple-600 mb-2">
                {result.percentage}%
              </div>
              <p className="text-lg text-gray-700 mb-4">
                You scored {result.score} out of {result.total_questions} questions correctly
              </p>
              <p className="text-sm text-gray-500">
                Time taken: {result.time_formatted}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{result.correct_count}</div>
                <div className="text-sm text-green-700">Correct</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{result.incorrect_count}</div>
                <div className="text-sm text-red-700">Incorrect</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-600">{result.unanswered_count}</div>
                <div className="text-sm text-gray-700">Unanswered</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate(`/attempt/${result.attempt_id}/review`)}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-5 w-5" />
                View Answers & Explanations
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-5 w-5" />
                Retake Quiz
              </button>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Score:</span>
                <span className="font-semibold">{result.score}/{result.total_questions} ({result.percentage}%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Time Taken:</span>
                <span className="font-semibold">{result.time_formatted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-semibold">{result.percentage}%</span>
              </div>
              {result.percentage >= 80 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">🎉 Excellent work! You've demonstrated strong understanding.</p>
                </div>
              )}
              {result.percentage >= 60 && result.percentage < 80 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 font-medium">👍 Good job! There's room for improvement.</p>
                </div>
              )}
              {result.percentage < 60 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">💪 Keep practicing! Review the explanations to improve.</p>
                </div>
              )}
            </div>
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

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Timer and Progress Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-purple-600" />
                <span className="font-semibold text-gray-900">{quiz.title}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </div>
                
                {timeLeft > 0 && (
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                    timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    <Clock className="h-4 w-4" />
                    <span className="font-mono font-semibold">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="card">
            {/* Question */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {question.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-8">
              {question.options.map((option, index) => (
                <label
                  key={index}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-purple-50 ${
                    userAnswer.includes(index)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`question_${currentQuestion}`}
                      value={index}
                      checked={userAnswer.includes(index)}
                      onChange={() => handleAnswerChange(index)}
                      className="w-5 h-5 text-purple-600"
                    />
                    <span className="text-lg text-gray-900">{option.text}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={goToPrevious}
                disabled={currentQuestion === 0}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </button>

              <div className="flex gap-3">
                {isLastQuestion ? (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
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
                    className="btn-primary flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    )
  }

  return null
}