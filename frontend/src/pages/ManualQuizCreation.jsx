import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { quizAPI, roomAPI } from '../utils/api'
import {
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Copy,
  PenTool,
  Home,
  BarChart3,
  PlusCircle,
  Users,
} from 'lucide-react'
import AnimatedTabs from '../components/AnimatedTabs'

export default function ManualQuizCreation() {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = location.state?.returnTo
  const roomData = location.state?.roomData

  const [quizTitle, setQuizTitle] = useState('')
  const [questions, setQuestions] = useState([
    {
      question: '',
      options: [
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
      ],
      explanation: '',
      tags: [],
    },
  ])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: [
          { text: '', is_correct: false },
          { text: '', is_correct: false },
          { text: '', is_correct: false },
          { text: '', is_correct: false },
        ],
        explanation: '',
        tags: [],
      },
    ])
  }

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const duplicateQuestion = (index) => {
    const newQuestion = { ...questions[index] }
    const newQuestions = [...questions]
    newQuestions.splice(index + 1, 0, newQuestion)
    setQuestions(newQuestions)
  }

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions]
    newQuestions[index][field] = value
    setQuestions(newQuestions)
  }

  const updateOption = (questionIndex, optionIndex, field, value) => {
    const newQuestions = [...questions]
    
    if (field === 'is_correct' && value) {
      // Uncheck all other options when one is checked
      newQuestions[questionIndex].options.forEach((opt, i) => {
        opt.is_correct = i === optionIndex
      })
    } else {
      newQuestions[questionIndex].options[optionIndex][field] = value
    }
    
    setQuestions(newQuestions)
  }

  const validateQuiz = () => {
    if (!quizTitle.trim()) {
      setError('Quiz title is required')
      return false
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      
      if (!q.question.trim()) {
        setError(`Question ${i + 1}: Question text is required`)
        return false
      }

      const hasCorrectAnswer = q.options.some(opt => opt.is_correct)
      if (!hasCorrectAnswer) {
        setError(`Question ${i + 1}: Please select a correct answer`)
        return false
      }

      const filledOptions = q.options.filter(opt => opt.text.trim())
      if (filledOptions.length < 2) {
        setError(`Question ${i + 1}: At least 2 options are required`)
        return false
      }
    }

    return true
  }

  const handleSave = async () => {
    setError('')
    
    if (!validateQuiz()) {
      return
    }

    setSaving(true)

    try {
      // Create quiz in backend
      const quizData = {
        title: quizTitle,
        questions: questions.map(q => ({
          question: q.question,
          options: q.options.filter(opt => opt.text.trim()),
          explanation: q.explanation || null,
          tags: q.tags || [],
        })),
      }

      const result = await quizAPI.createManualQuiz(quizData)

      // If coming from create room flow, create the room
      if (returnTo === 'create-room' && roomData) {
        const roomResult = await roomAPI.createRoom({
          ...roomData,
          quiz_id: result.quiz.id,
        })
        navigate(`/room/${roomResult.room.id}`)
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save quiz')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1a1f2e] to-[#252b3b] text-white border-b border-gray-800 sticky top-0 z-10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 text-base font-bold hover:scale-105 transition-all duration-200"
            >
              <ArrowLeft className="h-6 w-6" />
              <span>Back to Dashboard</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-2xl font-black hover:scale-105 transition-all duration-200 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-cyan-500/30 text-lg border-2 border-cyan-500"
            >
              {saving ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-6 w-6" />
                  Save Quiz
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 p-6 rounded-2xl shadow-2xl">
              <PenTool className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-white mb-4">
            Manual Quiz Creation
          </h1>
          <p className="text-xl text-gray-400 font-semibold">
            Create your custom quiz questions
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-500/20 border-2 border-red-500 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-lg font-semibold">
            <AlertCircle className="h-6 w-6" />
            <span>{error}</span>
          </div>
        )}

        {/* Quiz Title */}
        <div className="bg-[#1a1f2e] p-8 rounded-2xl shadow-2xl border border-gray-800 mb-8">
          <label className="block text-lg font-bold text-white mb-3">
            Quiz Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Enter quiz title"
            className="w-full px-6 py-4 bg-[#252b3b] border-2 border-gray-700 rounded-2xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all duration-200 text-2xl font-black text-white placeholder-gray-500 shadow-lg"
            maxLength={100}
          />
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="bg-[#1a1f2e] p-10 rounded-2xl shadow-2xl border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-black text-white flex items-center gap-3">
                  <span className="bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow-lg">
                    {qIndex + 1}
                  </span>
                  Question {qIndex + 1}
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => duplicateQuestion(qIndex)}
                    className="p-3 text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-all duration-200 hover:scale-110 shadow-lg border-2 border-cyan-500/30"
                    title="Duplicate question"
                  >
                    <Copy className="h-6 w-6" />
                  </button>
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(qIndex)}
                      className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 hover:scale-110 shadow-lg border-2 border-red-500/30"
                      title="Delete question"
                    >
                      <Trash2 className="h-6 w-6" />
                    </button>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-6">
                <label className="block text-lg font-bold text-white mb-3">
                  Question Text <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={question.question}
                  onChange={(e) =>
                    updateQuestion(qIndex, 'question', e.target.value)
                  }
                  placeholder="Enter your question"
                  rows={3}
                  className="w-full px-5 py-4 bg-[#252b3b] border-2 border-gray-700 rounded-2xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all duration-200 font-semibold text-white placeholder-gray-500 shadow-md resize-none"
                />
              </div>

              {/* Options */}
              <div className="mb-6">
                <label className="block text-lg font-bold text-white mb-4">
                  Answer Options <span className="text-red-400">*</span>
                  <span className="text-gray-400 ml-3 text-sm font-semibold">
                    (Select the correct answer)
                  </span>
                </label>
                <div className="space-y-4">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          updateOption(qIndex, oIndex, 'is_correct', !option.is_correct)
                        }
                        className={`flex-shrink-0 w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 ${
                          option.is_correct
                            ? 'border-green-500 bg-gradient-to-br from-green-500 to-emerald-500'
                            : 'border-gray-700 hover:border-green-400 bg-[#252b3b]'
                        }`}
                      >
                        {option.is_correct && (
                          <CheckCircle className="h-6 w-6 text-white" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) =>
                            updateOption(qIndex, oIndex, 'text', e.target.value)
                          }
                          placeholder={`Option ${oIndex + 1}`}
                          className={`w-full px-5 py-4 border-2 rounded-2xl focus:ring-2 outline-none transition-all duration-200 font-semibold text-white placeholder-gray-500 shadow-md ${
                            option.is_correct
                              ? 'border-green-500 bg-green-500/10 focus:ring-green-500/20'
                              : 'border-gray-700 bg-[#252b3b] focus:border-cyan-500 focus:ring-cyan-500/20'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div className="mb-6">
                <label className="block text-lg font-bold text-white mb-3">
                  Explanation <span className="text-gray-500 font-semibold">(Optional)</span>
                </label>
                <textarea
                  value={question.explanation}
                  onChange={(e) =>
                    updateQuestion(qIndex, 'explanation', e.target.value)
                  }
                  placeholder="Add an explanation for the correct answer"
                  rows={2}
                  className="w-full px-5 py-4 bg-[#252b3b] border-2 border-gray-700 rounded-2xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all duration-200 font-semibold text-white placeholder-gray-500 shadow-md resize-none"
                />
              </div>

              {/* Tags/Topics */}
              <div>
                <label className="block text-lg font-bold text-white mb-3">
                  Tags/Topics <span className="text-gray-500 font-semibold">(Optional - for analytics)</span>
                </label>
                <input
                  type="text"
                  value={question.tags?.join(', ') || ''}
                  onChange={(e) => {
                    const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                    updateQuestion(qIndex, 'tags', tagsArray);
                  }}
                  placeholder="e.g., Algebra, Geometry, History (comma-separated)"
                  className="w-full px-5 py-4 bg-[#252b3b] border-2 border-gray-700 rounded-2xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all duration-200 font-semibold text-white placeholder-gray-500 shadow-md"
                />
                <p className="text-sm text-gray-400 mt-2 font-semibold bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/30">
                  ðŸ’¡ Add topics to track performance by category in analytics
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Add Question Button */}
        <div className="mt-10">
          <button
            onClick={addQuestion}
            className="w-full py-6 border-2 border-dashed border-gray-700 rounded-2xl text-gray-400 hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200 flex items-center justify-center gap-3 font-black text-xl shadow-xl hover:scale-[1.02]"
          >
            <Plus className="h-7 w-7" />
            Add Another Question
          </button>
        </div>

        {/* Summary */}
        <div className="bg-[#1a1f2e] rounded-2xl p-6 mt-6 border-2 border-cyan-500/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Questions</p>
              <p className="text-3xl font-bold text-white">{questions.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-green-500">
                {questions.filter(q => 
                  q.question.trim() && 
                  q.options.some(o => o.is_correct) &&
                  q.options.filter(o => o.text.trim()).length >= 2
                ).length}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


