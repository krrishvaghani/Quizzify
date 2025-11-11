import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { quizAPI } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, Clock, BookOpen } from 'lucide-react'

export default function TakeQuiz() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [quiz, setQuiz] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30) // Default 30 seconds per question

  // Shuffle array function (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  useEffect(() => {
    fetchQuiz()
  }, [quizId])

  // Per-question timer - resets when question changes
  useEffect(() => {
    if (!quiz) return
    
    // Reset timer for each new question (30 seconds default)
    setTimeLeft(30)
  }, [currentQuestion, quiz])

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Auto-advance to next question when time runs out
          if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(prev => prev + 1)
          } else {
            // Submit quiz if on last question
            handleSubmit()
          }
          return 30 // Reset for next question
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, currentQuestion, quiz])

  const fetchQuiz = async () => {
    try {
      const data = await quizAPI.getQuiz(quizId)
      let loadedQuiz = data
      
      // ALWAYS apply shuffling for variety
      if (loadedQuiz && loadedQuiz.questions) {
        // Shuffle options for each question
        loadedQuiz.questions = loadedQuiz.questions.map(question => ({
          ...question,
          options: shuffleArray(question.options)
        }))
        
        // Shuffle question order
        loadedQuiz.questions = shuffleArray(loadedQuiz.questions)
      }
      
      setQuiz(loadedQuiz)
    } catch (error) {
      console.error('Error fetching quiz:', error)
      alert('Failed to load quiz')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)

    try {
      const submission = {
        quiz_id: parseInt(quizId),
        answers: Object.entries(answers).map(([qIndex, answer]) => ({
          question_index: parseInt(qIndex),
          selected_answer: answer
        }))
      }

      await quizAPI.submitQuiz(submission)
      alert('Quiz submitted successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error submitting quiz:', error)
      alert('Failed to submit quiz')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-white text-xl">Loading quiz...</div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-white text-xl">Quiz not found</div>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#0f1419] to-[#1a2332]">
      {/* Header */}
      <header className="bg-[#1e2936]/80 backdrop-blur-sm border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-white text-lg font-bold tracking-wide">QUIZIFY</span>
          </div>

          {timeLeft !== null && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              timeLeft < 10 
                ? 'bg-red-500/20 border border-red-500/40 animate-pulse' 
                : 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20'
            }`}>
              <Clock className={`h-5 w-5 ${timeLeft < 10 ? 'text-red-400' : 'text-cyan-400'}`} />
              <span className={`font-mono font-bold text-xl ${timeLeft < 10 ? 'text-red-300' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Quiz Title and Progress */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          {quiz.title}
        </h1>
        
        {/* Progress Bar */}
        <div className="bg-[#1e2936]/50 backdrop-blur-sm rounded-lg border border-gray-800/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm font-bold text-cyan-400">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2.5 bg-gray-800/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500 ease-out shadow-lg shadow-cyan-500/30"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="bg-gradient-to-br from-[#1e2936] to-[#1a2332] rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden">
          {/* Question Number Badge */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="text-2xl font-bold text-white">{currentQuestion + 1}</span>
              </div>
              <h2 className="text-2xl font-bold text-white flex-1 leading-relaxed">
                {question.question_text}
              </h2>
            </div>
          </div>
          
          {/* Options */}
          <div className="px-8 pb-8 space-y-3">
            {question.options.map((option, index) => {
              const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F']
              const isSelected = answers[currentQuestion] === option
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion, option)}
                  className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border-2 border-cyan-500 shadow-lg shadow-cyan-500/20'
                      : 'bg-[#252d3d]/80 border-2 border-gray-700/50 hover:border-gray-600 hover:bg-[#2a3444]'
                  }`}
                >
                  <div className="flex items-center gap-4 p-5">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/40'
                        : 'bg-gray-700/80 text-gray-300 group-hover:bg-gray-600'
                    }`}>
                      {optionLabels[index]}
                    </div>
                    <span className={`flex-1 text-left font-medium transition-colors ${
                      isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`}>
                      {option}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Navigation Dots */}
          <div className="flex items-center justify-center gap-2 px-8 pb-6">
            {quiz.questions.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentQuestion
                    ? 'w-8 bg-gradient-to-r from-cyan-500 to-blue-500'
                    : idx < currentQuestion
                    ? 'w-2 bg-green-500'
                    : 'w-2 bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="px-8 pb-8">
            {currentQuestion < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                className="w-full group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                <span>Next</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
