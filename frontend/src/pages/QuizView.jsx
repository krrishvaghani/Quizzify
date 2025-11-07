import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { quizAPI } from '../utils/api'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  BookOpen,
  Award,
  RotateCcw,
} from 'lucide-react'

export default function QuizView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    fetchQuiz()
  }, [id])

  const fetchQuiz = async () => {
    try {
      const data = await quizAPI.getQuiz(id)
      setQuiz(data)
    } catch (error) {
      console.error('Error fetching quiz:', error)
      alert('Failed to load quiz')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    if (showResults) return
    
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex,
    })
  }

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < quiz.questions.length) {
      if (!window.confirm('You haven\'t answered all questions. Submit anyway?')) {
        return
      }
    }

    let correctCount = 0
    quiz.questions.forEach((question, index) => {
      const selectedOption = selectedAnswers[index]
      if (selectedOption !== undefined && question.options[selectedOption].is_correct) {
        correctCount++
      }
    })

    setScore(correctCount)
    setShowResults(true)
  }

  const handleRetake = () => {
    setSelectedAnswers({})
    setShowResults(false)
    setScore(0)
    setCurrentQuestion(0)
  }

  const getScoreColor = () => {
    const percentage = (score / quiz.questions.length) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = () => {
    const percentage = (score / quiz.questions.length) * 100
    if (percentage >= 80) return 'bg-green-50 border-green-200'
    if (percentage >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
      </div>
    )
  }

  if (!quiz) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Header */}
        <div className="card mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {quiz.title}
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {quiz.questions.length} Questions
              </p>
            </div>
            {!showResults && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Progress</p>
                <p className="text-2xl font-bold text-primary-600">
                  {Object.keys(selectedAnswers).length} / {quiz.questions.length}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Results Summary */}
        {showResults && (
          <div className={`card mb-8 ${getScoreBgColor()} border-2`}>
            <div className="text-center">
              <Award className={`h-16 w-16 mx-auto mb-4 ${getScoreColor()}`} />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Quiz Completed!
              </h2>
              <p className="text-xl text-gray-700 mb-4">
                Your Score:{' '}
                <span className={`font-bold ${getScoreColor()}`}>
                  {score} / {quiz.questions.length}
                </span>
              </p>
              <p className="text-lg text-gray-600 mb-6">
                {((score / quiz.questions.length) * 100).toFixed(0)}% Correct
              </p>
              <button
                onClick={handleRetake}
                className="btn-primary inline-flex items-center gap-2"
              >
                <RotateCcw className="h-5 w-5" />
                Retake Quiz
              </button>
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {quiz.questions.map((question, questionIndex) => {
            const selectedOption = selectedAnswers[questionIndex]
            const isAnswered = selectedOption !== undefined

            return (
              <div key={questionIndex} className="card">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    {questionIndex + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {question.question}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 ml-14">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = selectedOption === optionIndex
                    const isCorrect = option.is_correct
                    const showCorrect = showResults && isCorrect
                    const showIncorrect = showResults && isSelected && !isCorrect

                    let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-all '
                    
                    if (showCorrect) {
                      buttonClass += 'border-green-500 bg-green-50 '
                    } else if (showIncorrect) {
                      buttonClass += 'border-red-500 bg-red-50 '
                    } else if (isSelected) {
                      buttonClass += 'border-primary-500 bg-primary-50 '
                    } else {
                      buttonClass += 'border-gray-300 hover:border-primary-400 hover:bg-gray-50 '
                    }

                    return (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                        disabled={showResults}
                        className={buttonClass}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">
                            {option.text}
                          </span>
                          {showCorrect && (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          )}
                          {showIncorrect && (
                            <XCircle className="h-6 w-6 text-red-600" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Explanation */}
                {showResults && question.explanation && (
                  <div className="ml-14 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Explanation:
                    </p>
                    <p className="text-sm text-blue-800">{question.explanation}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Submit Button */}
        {!showResults && (
          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(selectedAnswers).length === 0}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
