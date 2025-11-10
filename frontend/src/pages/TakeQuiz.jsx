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
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    fetchQuiz()
  }, [quizId])

  useEffect(() => {
    if (quiz && quiz.time_limit) {
      setTimeLeft(quiz.time_limit * 60)
    }
  }, [quiz])

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const fetchQuiz = async () => {
    try {
      const data = await quizAPI.getQuiz(quizId)
      setQuiz(data)
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
    <div className="min-h-screen bg-[#0f1419]">
      {/* Header */}
      <header className="bg-[#1a1f2e] border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Exit Quiz</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-bold">{quiz.title}</span>
          </div>

          {timeLeft !== null && (
            <div className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5" />
              <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-[#1a1f2e] border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm text-gray-400">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">{question.question_text}</h2>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, option)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  answers[currentQuestion] === option
                    ? 'border-cyan-500 bg-cyan-500/10 text-white'
                    : 'border-gray-700 bg-[#252b3b] text-gray-300 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion] === option
                      ? 'border-cyan-500 bg-cyan-500'
                      : 'border-gray-600'
                  }`}>
                    {answers[currentQuestion] === option && (
                      <div className="w-3 h-3 rounded-full bg-white" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-4 mt-8">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Previous
              </button>
            )}
            
            {currentQuestion < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                disabled={!answers[currentQuestion]}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:opacity-90 text-white rounded-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(answers).length !== quiz.questions.length}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white rounded-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-bold"
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
