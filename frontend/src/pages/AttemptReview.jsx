import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { quizAPI } from '../utils/api'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Award,
  BookOpen,
  AlertCircle,
  Lightbulb,
  RotateCcw,
} from 'lucide-react'

export default function AttemptReview() {
  const { attemptId } = useParams()
  const navigate = useNavigate()
  
  const [attempt, setAttempt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadAttemptDetails = async () => {
      try {
        const data = await quizAPI.getAttemptDetails(attemptId)
        setAttempt(data.attempt)
      } catch (err) {
        setError('Failed to load attempt details')
      } finally {
        setLoading(false)
      }
    }

    if (attemptId) {
      loadAttemptDetails()
    }
  }, [attemptId])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`
    } else {
      return `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`
    }
  }

  const getAnswerStatus = (questionDetail) => {
    if (!questionDetail.is_answered) {
      return { status: 'unanswered', icon: AlertCircle, color: 'text-gray-500', bg: 'bg-gray-50' }
    } else if (questionDetail.is_correct) {
      return { status: 'correct', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' }
    } else {
      return { status: 'incorrect', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Results Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="btn-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Results</span>
            </button>
            
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-black" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{attempt.quiz_title}</h1>
                <p className="text-sm text-gray-500">Answer Review</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Card */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-lg font-semibold text-gray-900">{attempt.student_name}</span>
              </div>
              <p className="text-gray-600">{attempt.student_email}</p>
            </div>
            
            <div className="mt-4 lg:mt-0 flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{attempt.percentage}%</div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{formatTime(attempt.time_taken)}</div>
                <div className="text-sm text-gray-500">Time Taken</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-xl font-bold text-black">{attempt.score}/{attempt.total_questions}</div>
              <div className="text-sm text-gray-600">Total Score</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">{attempt.correct_answers.length}</div>
              <div className="text-sm text-green-700">Correct</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-xl font-bold text-red-600">{attempt.incorrect_answers.length}</div>
              <div className="text-sm text-red-700">Incorrect</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-600">{attempt.unanswered.length}</div>
              <div className="text-sm text-gray-700">Unanswered</div>
            </div>
          </div>
        </div>

        {/* Questions Review */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Answer Review</h2>
          
          {attempt.question_details.map((questionDetail, index) => {
            const answerStatus = getAnswerStatus(questionDetail)
            const StatusIcon = answerStatus.icon

            return (
              <div key={index} className="card">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-2 rounded-full ${answerStatus.bg}`}>
                    <StatusIcon className={`h-5 w-5 ${answerStatus.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        answerStatus.status === 'correct' ? 'bg-green-100 text-green-800' :
                        answerStatus.status === 'incorrect' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {answerStatus.status === 'correct' ? 'Correct' :
                         answerStatus.status === 'incorrect' ? 'Incorrect' : 'Unanswered'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {questionDetail.question}
                    </h3>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-4">
                  {questionDetail.options.map((option, optionIndex) => {
                    const isCorrect = questionDetail.correct_indices.includes(optionIndex)
                    const isUserAnswer = questionDetail.user_answers.includes(optionIndex)
                    
                    let optionClasses = "p-3 rounded-lg border-2 "
                    if (isCorrect && isUserAnswer) {
                      optionClasses += "bg-green-50 border-green-500 text-green-900"
                    } else if (isCorrect) {
                      optionClasses += "bg-green-50 border-green-300 text-green-900"
                    } else if (isUserAnswer) {
                      optionClasses += "bg-red-50 border-red-500 text-red-900"
                    } else {
                      optionClasses += "bg-gray-50 border-gray-200 text-gray-700"
                    }

                    return (
                      <div key={optionIndex} className={optionClasses}>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {isCorrect && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            {isUserAnswer && !isCorrect && (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                          <span>{option}</span>
                          <div className="ml-auto flex gap-2">
                            {isCorrect && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                Correct Answer
                              </span>
                            )}
                            {isUserAnswer && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Your Answer
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Explanation */}
                {questionDetail.explanation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Explanation</h4>
                        <p className="text-blue-800">{questionDetail.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.href = `/quiz/${attempt.quiz_id}/start`}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="h-5 w-5" />
            Retake Quiz
          </button>
        </div>
      </main>
    </div>
  )
}
