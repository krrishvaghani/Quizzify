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
} from 'lucide-react'

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(returnTo === 'create-room' ? '/create-room' : '/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Quiz
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
              <PenTool className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Manual Quiz Creation
          </h1>
          <p className="text-lg text-gray-600">
            Create your custom quiz questions
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Quiz Title */}
        <div className="card mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quiz Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Enter quiz title"
            className="input-field text-xl font-semibold"
            maxLength={100}
          />
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Question {qIndex + 1}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => duplicateQuestion(qIndex)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Duplicate question"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(qIndex)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete question"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={question.question}
                  onChange={(e) =>
                    updateQuestion(qIndex, 'question', e.target.value)
                  }
                  placeholder="Enter your question"
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              {/* Options */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Answer Options <span className="text-red-500">*</span>
                  <span className="text-gray-500 ml-2 text-xs">
                    (Select the correct answer)
                  </span>
                </label>
                <div className="space-y-3">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateOption(qIndex, oIndex, 'is_correct', !option.is_correct)
                        }
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          option.is_correct
                            ? 'border-green-600 bg-green-600'
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {option.is_correct && (
                          <CheckCircle className="h-4 w-4 text-white" />
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
                          className={`input-field ${
                            option.is_correct
                              ? 'border-green-500 bg-green-50'
                              : ''
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Explanation <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  value={question.explanation}
                  onChange={(e) =>
                    updateQuestion(qIndex, 'explanation', e.target.value)
                  }
                  placeholder="Add an explanation for the correct answer"
                  rows={2}
                  className="input-field resize-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add Question Button */}
        <div className="mt-6">
          <button
            onClick={addQuestion}
            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="h-5 w-5" />
            Add Another Question
          </button>
        </div>

        {/* Summary */}
        <div className="card mt-6 bg-gray-100 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Questions</p>
              <p className="text-3xl font-bold text-gray-900">{questions.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">
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
