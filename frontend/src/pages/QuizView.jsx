import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { quizAPI } from '../utils/api'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  BookOpen,
  Award,
  RotateCcw,
  Edit3,
  Share2,
  Copy,
  Check,
  Download,
  ChevronLeft,
  ChevronRight,
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
  const [copied, setCopied] = useState(false)

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

  const handleCopyLink = () => {
    const quizLink = `${window.location.origin}/quiz/${id}/start`
    navigator.clipboard.writeText(quizLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
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
      <div className="min-h-screen flex items-center justify-center bg-[#0f1419]">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
      </div>
    )
  }

  if (!quiz) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Header */}
      <header className="bg-[#1a1f2e] border-b border-gray-800 shadow-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-semibold"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
            
            {!showResults && (
              <div className="flex gap-3">
                <Link
                  to={`/quiz/${id}/export`}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2 font-semibold"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Link>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center gap-2 font-semibold"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" />
                      Share
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Share Link Section */}
        {!showResults && (
          <div className="bg-[#1a1f2e] rounded-2xl border border-gray-800 p-6 mb-6 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Share Quiz with Students</h3>
                  <p className="text-sm text-gray-400">Students can take this quiz without logging in</p>
                </div>
              </div>
              <button
                onClick={handleCopyLink}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
            <div className="mt-4 p-4 bg-[#252b3b] rounded-xl border border-gray-700">
              <p className="text-sm text-cyan-400 font-mono break-all">
                {window.location.origin}/quiz/{id}/start
              </p>
            </div>
          </div>
        )}

        {/* Quiz Header */}
        <div className="bg-[#1a1f2e] rounded-2xl border border-gray-800 p-8 mb-8 shadow-xl">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-3">
                {quiz.title}
              </h1>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold">{quiz.questions.length} Questions</span>
                </div>
              </div>
            </div>
            {!showResults && (
              <div className="text-right bg-[#252b3b] px-6 py-4 rounded-xl border border-gray-700">
                <p className="text-sm text-gray-400 mb-1">Progress</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {currentQuestion + 1} / {quiz.questions.length}
                </p>
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          {!showResults && (
            <div className="mt-6">
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {showResults && (
          <div className="bg-[#1a1f2e] rounded-2xl border-2 border-cyan-500/30 p-10 mb-8 shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Award className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Quiz Completed! 🎉
              </h2>
              <p className="text-xl text-gray-400 mb-4">
                Your Score:{' '}
                <span className="font-bold text-3xl bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {score} / {quiz.questions.length}
                </span>
              </p>
              <p className="text-2xl font-bold text-cyan-400 mb-8">
                {((score / quiz.questions.length) * 100).toFixed(0)}% Correct
              </p>
              <button
                onClick={handleRetake}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 inline-flex items-center gap-3 group"
              >
                <RotateCcw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                Retake Quiz
              </button>
            </div>
          </div>
        )}

        {/* Current Question */}
        {!showResults && (
          <>
            <div className="bg-[#1a1f2e] rounded-2xl border border-gray-800 p-8 mb-6 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
                  {currentQuestion + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-2 font-semibold">Question {currentQuestion + 1} of {quiz.questions.length}</p>
                  <h3 className="text-2xl font-bold text-white leading-relaxed">
                    {quiz.questions[currentQuestion].question}
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                {quiz.questions[currentQuestion].options.map((option, optionIndex) => {
                  const isSelected = selectedAnswers[currentQuestion] === optionIndex

                  return (
                    <button
                      key={optionIndex}
                      onClick={() => handleAnswerSelect(currentQuestion, optionIndex)}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                          : 'border-gray-700 bg-[#252b3b] hover:border-cyan-500/50 hover:bg-[#2d3548]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-gray-600'
                        }`}>
                          {isSelected && <div className="w-3 h-3 bg-white rounded-full"></div>}
                        </div>
                        <span className={`font-semibold text-lg ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                          {option.text}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-[#1a1f2e] text-white border border-gray-700 rounded-xl font-semibold hover:bg-[#252b3b] hover:border-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </button>

              <div className="flex gap-2 flex-wrap justify-center">
                {quiz.questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${
                      idx === currentQuestion
                        ? 'bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 text-white shadow-lg'
                        : selectedAnswers[idx] !== undefined
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                        : 'bg-[#252b3b] text-gray-400 border border-gray-700 hover:bg-[#2d3548] hover:border-cyan-500/50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {currentQuestion < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Submit Quiz
                  <CheckCircle className="h-5 w-5" />
                </button>
              )}
            </div>
          </>
        )}

        {/* Results View - Show All Questions After Submission */}
        {showResults && (
          <div className="space-y-6">
            {quiz.questions.map((question, questionIndex) => {
              const selectedOption = selectedAnswers[questionIndex]
              
              return (
                <div key={questionIndex} className="bg-[#1a1f2e] rounded-2xl border border-gray-800 p-6 shadow-lg">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                      {questionIndex + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white leading-relaxed">
                        {question.question}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3 ml-16">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = selectedOption === optionIndex
                      const isCorrect = option.is_correct
                      const showCorrect = isCorrect
                      const showIncorrect = isSelected && !isCorrect

                      let buttonClass = 'w-full text-left p-4 rounded-xl border-2 transition-all '
                      
                      if (showCorrect) {
                        buttonClass += 'border-green-500 bg-green-500/10 '
                      } else if (showIncorrect) {
                        buttonClass += 'border-red-500 bg-red-500/10 '
                      } else {
                        buttonClass += 'border-gray-700 bg-[#252b3b] '
                      }

                      return (
                        <div key={optionIndex} className={buttonClass}>
                          <div className="flex items-center justify-between">
                            <span className={`font-semibold ${showCorrect ? 'text-green-400' : showIncorrect ? 'text-red-400' : 'text-gray-400'}`}>
                              {option.text}
                            </span>
                            {showCorrect && (
                              <CheckCircle className="h-6 w-6 text-green-400" />
                            )}
                            {showIncorrect && (
                              <XCircle className="h-6 w-6 text-red-400" />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Explanation */}
                  {question.explanation && (
                    <div className="ml-16 mt-4 p-4 bg-blue-500/10 border-2 border-blue-500/30 rounded-xl">
                      <p className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Explanation:
                      </p>
                      <p className="text-sm text-gray-300 leading-relaxed">{question.explanation}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}


