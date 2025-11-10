import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { quizAPI } from '../utils/api'
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Eye,
  AlertCircle,
  BookOpen,
  CheckCircle,
  X,
  Tag,
  Lightbulb,
  Edit3,
} from 'lucide-react'

export default function QuizEditor() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    loadQuiz()
  }, [quizId])

  const loadQuiz = async () => {
    try {
      setLoading(true)
      const data = await quizAPI.getQuiz(quizId)
      setQuiz(data) // Backend returns quiz directly, not wrapped
    } catch (err) {
      console.error('Error loading quiz:', err)
      setError('Failed to load quiz. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuizTitleChange = (value) => {
    setQuiz({ ...quiz, title: value })
  }

  const handleQuestionChange = (questionIndex, field, value) => {
    const updatedQuestions = [...quiz.questions]
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value
    }
    setQuiz({ ...quiz, questions: updatedQuestions })
  }

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...quiz.questions]
    const updatedOptions = [...updatedQuestions[questionIndex].options]
    
    if (field === 'is_correct') {
      // For single correct answer, uncheck others when one is checked
      updatedOptions.forEach((opt, idx) => {
        opt.is_correct = idx === optionIndex ? value : false
      })
    } else {
      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        [field]: value
      }
    }
    
    updatedQuestions[questionIndex].options = updatedOptions
    setQuiz({ ...quiz, questions: updatedQuestions })
  }

  const addOption = (questionIndex) => {
    const updatedQuestions = [...quiz.questions]
    updatedQuestions[questionIndex].options.push({
      text: '',
      is_correct: false
    })
    setQuiz({ ...quiz, questions: updatedQuestions })
  }

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...quiz.questions]
    if (updatedQuestions[questionIndex].options.length > 2) {
      updatedQuestions[questionIndex].options.splice(optionIndex, 1)
      setQuiz({ ...quiz, questions: updatedQuestions })
    }
  }

  const addQuestion = () => {
    const newQuestion = {
      question: '',
      options: [
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false }
      ],
      explanation: '',
      difficulty: 'medium',
      tags: []
    }
    setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] })
  }

  const removeQuestion = (questionIndex) => {
    if (quiz.questions.length > 1) {
      const updatedQuestions = quiz.questions.filter((_, idx) => idx !== questionIndex)
      setQuiz({ ...quiz, questions: updatedQuestions })
    }
  }

  const handleSave = async () => {
    try {
      // Validation
      if (!quiz.title.trim()) {
        setError('Quiz title is required')
        return
      }

      for (let i = 0; i < quiz.questions.length; i++) {
        const q = quiz.questions[i]
        if (!q.question.trim()) {
          setError(`Question ${i + 1}: Question text is required`)
          return
        }

        const hasCorrectAnswer = q.options.some(opt => opt.is_correct)
        if (!hasCorrectAnswer) {
          setError(`Question ${i + 1}: At least one correct answer must be marked`)
          return
        }

        const emptyOptions = q.options.filter(opt => !opt.text.trim())
        if (emptyOptions.length > 0) {
          setError(`Question ${i + 1}: All option texts must be filled`)
          return
        }
      }

      setSaving(true)
      setError('')
      
      await quizAPI.updateQuiz(quizId, {
        title: quiz.title,
        questions: quiz.questions.map(q => ({
          question: q.question,
          options: q.options,
          explanation: q.explanation || '',
          difficulty: q.difficulty || 'medium',
          tags: q.tags || []
        }))
      })
      
      setSuccess('Quiz saved successfully!')
      setTimeout(() => {
        navigate(`/quiz/${quizId}`)
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save quiz')
    } finally {
      setSaving(false)
    }
  }

  const handleAddTag = (questionIndex, tag) => {
    if (tag && !quiz.questions[questionIndex].tags?.includes(tag)) {
      const updatedQuestions = [...quiz.questions]
      updatedQuestions[questionIndex].tags = [
        ...(updatedQuestions[questionIndex].tags || []),
        tag
      ]
      setQuiz({ ...quiz, questions: updatedQuestions })
    }
  }

  const handleRemoveTag = (questionIndex, tagIndex) => {
    const updatedQuestions = [...quiz.questions]
    updatedQuestions[questionIndex].tags.splice(tagIndex, 1)
    setQuiz({ ...quiz, questions: updatedQuestions })
  }

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

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The quiz you are looking for does not exist.'}</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Preview Modal
  if (showPreview) {
    return (
      <div className="min-h-screen bg-[#0f1419]">
        <header className="bg-[#1a1f2e] shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-purple-600" />
                <div>
                  <h1 className="text-xl font-bold text-white">{quiz.title}</h1>
                  <p className="text-sm text-gray-500">Preview Mode</p>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="btn-secondary flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Close Preview
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {quiz.questions.map((question, qIdx) => (
            <div key={qIdx} className="card mb-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Question {qIdx + 1}
                </h3>
                {question.difficulty && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    question.difficulty === 'hard' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {question.difficulty}
                  </span>
                )}
              </div>
              
              <p className="text-white mb-4">{question.question}</p>
              
              <div className="space-y-2 mb-4">
                {question.options.map((option, oIdx) => (
                  <div
                    key={oIdx}
                    className={`p-3 rounded-lg border-2 ${
                      option.is_correct
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-[#1a1f2e]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {option.is_correct && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      <span className={option.is_correct ? 'text-green-900 font-medium' : 'text-gray-700'}>
                        {option.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {question.explanation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Explanation</p>
                      <p className="text-sm text-blue-800">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              )}

              {question.tags && question.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {question.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Header */}
      <header className="bg-[#1a1f2e] shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/quiz/${quizId}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Quiz</span>
            </button>
            
            <div className="flex items-center gap-3">
              <Edit3 className="h-6 w-6 text-purple-600" />
              <div>
                <h1 className="text-lg font-semibold text-white">Edit Quiz</h1>
                <p className="text-sm text-gray-500">{quiz.questions.length} questions</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Quiz Title */}
        <div className="card mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quiz Title
          </label>
          <input
            type="text"
            value={quiz.title}
            onChange={(e) => handleQuizTitleChange(e.target.value)}
            className="input-field text-xl font-semibold"
            placeholder="Enter quiz title"
          />
        </div>

        {/* Questions */}
        {quiz.questions.map((question, qIdx) => (
          <div key={qIdx} className="card mb-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Question {qIdx + 1}
              </h3>
              <button
                onClick={() => removeQuestion(qIdx)}
                disabled={quiz.questions.length === 1}
                className={`p-2 rounded-lg transition-colors ${
                  quiz.questions.length === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-red-600 hover:bg-red-50'
                }`}
                title="Delete question"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            {/* Question Text */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text
              </label>
              <textarea
                value={question.question}
                onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)}
                className="input-field min-h-[100px]"
                placeholder="Enter your question"
              />
            </div>

            {/* Options */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer Options
              </label>
              <div className="space-y-3">
                {question.options.map((option, oIdx) => (
                  <div key={oIdx} className="flex gap-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={option.is_correct}
                        onChange={(e) => handleOptionChange(qIdx, oIdx, 'is_correct', e.target.checked)}
                        className="h-5 w-5 text-purple-600 cursor-pointer"
                        title="Mark as correct answer"
                      />
                    </div>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(qIdx, oIdx, 'text', e.target.value)}
                      className={`input-field flex-1 ${option.is_correct ? 'border-green-500 bg-green-50' : ''}`}
                      placeholder={`Option ${oIdx + 1}`}
                    />
                    <button
                      onClick={() => removeOption(qIdx, oIdx)}
                      disabled={question.options.length <= 2}
                      className={`p-2 rounded-lg transition-colors ${
                        question.options.length <= 2
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                      title="Remove option"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => addOption(qIdx)}
                className="mt-3 btn-secondary text-sm flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Option
              </button>
            </div>

            {/* Explanation */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Explanation (Optional)
                </div>
              </label>
              <textarea
                value={question.explanation || ''}
                onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                className="input-field min-h-[80px]"
                placeholder="Explain why this is the correct answer"
              />
            </div>

            {/* Difficulty */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={question.difficulty || 'medium'}
                onChange={(e) => handleQuestionChange(qIdx, 'difficulty', e.target.value)}
                className="input-field"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags / Topics
                </div>
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(question.tags || []).map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full flex items-center gap-2"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(qIdx, tIdx)}
                      className="hover:text-purple-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input-field flex-1"
                  placeholder="Add a tag (press Enter)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag(qIdx, e.target.value.trim())
                      e.target.value = ''
                    }
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Question Button */}
        <button
          onClick={addQuestion}
          className="w-full btn-secondary py-4 flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add New Question
        </button>
      </main>
    </div>
  )
}


