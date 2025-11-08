import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { quizAPI, roomAPI } from '../utils/api'
import {
  ArrowLeft,
  ArrowRight,
  Users,
  Clock,
  Shuffle,
  RotateCw,
  CheckCircle,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Trophy,
  Settings as SettingsIcon,
  Bot,
  PenTool,
} from 'lucide-react'

export default function CreateRoom() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingQuizzes, setLoadingQuizzes] = useState(true)
  const [error, setError] = useState('')
  const [quizCreationMethod, setQuizCreationMethod] = useState(null) // 'ai' or 'manual'

  // Room data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quiz_id: '',
    settings: {
      enable_timer: false,
      timer_duration: 60,
      shuffle_questions: false,
      shuffle_options: false,
      attempts_allowed: 1,
      show_results_immediately: true,
    },
  })

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      const data = await quizAPI.getQuizzes()
      setQuizzes(data.quizzes || [])
    } catch (error) {
      console.error('Error fetching quizzes:', error)
      setError('Failed to load quizzes')
    } finally {
      setLoadingQuizzes(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSettingToggle = (setting) => {
    setFormData({
      ...formData,
      settings: {
        ...formData.settings,
        [setting]: !formData.settings[setting],
      },
    })
  }

  const handleSettingChange = (setting, value) => {
    setFormData({
      ...formData,
      settings: {
        ...formData.settings,
        [setting]: value,
      },
    })
  }

  const handleNext = () => {
    setError('')

    if (step === 1) {
      if (!formData.title.trim()) {
        setError('Room title is required')
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!quizCreationMethod) {
        setError('Please select a quiz option')
        return
      }
      if (quizCreationMethod === 'existing') {
        setStep(3)
      } else if (quizCreationMethod === 'ai') {
        // Navigate to AI quiz generation
        navigate('/generate', { state: { returnTo: 'create-room', roomData: formData } })
      } else if (quizCreationMethod === 'manual') {
        // Navigate to manual quiz creation
        navigate('/create-manual-quiz', { state: { returnTo: 'create-room', roomData: formData } })
      }
    } else if (step === 3) {
      if (!formData.quiz_id) {
        setError('Please select a quiz')
        return
      }
      handleCreateRoom()
    }
  }

  const handleCreateRoom = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await roomAPI.createRoom(formData)
      navigate(`/room/${result.room.id}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create room')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Create a Room
          </h1>
          <p className="text-gray-500">
            Set up a quiz room for people to join
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-base ${
                    s <= step
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      s < step ? 'bg-black' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-12 mt-3 text-xs text-gray-500">
            <p>Details</p>
            <p>Quiz</p>
            <p>Settings</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Room Details & Settings */}
        {step === 1 && (
          <div className="card max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <SettingsIcon className="h-6 w-6 text-black" />
                Room Details & Settings
              </h2>
            </div>

            {/* Room Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter room title"
                className="input-field"
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your quiz room"
                rows={3}
                className="input-field resize-none"
                maxLength={500}
              />
            </div>

            {/* Quiz Features */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quiz Features
              </h3>

              {/* Enable Timer */}
              <div className="mb-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-black" />
                    <div>
                      <p className="font-medium text-gray-900">Enable Timer</p>
                      <p className="text-sm text-gray-500">
                        Set time limit per question
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingToggle('enable_timer')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.settings.enable_timer
                        ? 'bg-black'
                        : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.settings.enable_timer
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {formData.settings.enable_timer && (
                  <div className="mt-3 ml-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timer Duration (seconds): {formData.settings.timer_duration}
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="300"
                      step="15"
                      value={formData.settings.timer_duration}
                      onChange={(e) =>
                        handleSettingChange('timer_duration', parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>15s</span>
                      <span>5min</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Shuffle Questions */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <Shuffle className="h-5 w-5 text-black" />
                  <div>
                    <p className="font-medium text-gray-900">Shuffle Questions</p>
                    <p className="text-sm text-gray-500">
                      Randomize question order
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingToggle('shuffle_questions')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.settings.shuffle_questions
                      ? 'bg-black'
                      : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.settings.shuffle_questions
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Shuffle Options */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <RotateCw className="h-5 w-5 text-black" />
                  <div>
                    <p className="font-medium text-gray-900">Shuffle Options</p>
                    <p className="text-sm text-gray-500">
                      Randomize answer options
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingToggle('shuffle_options')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.settings.shuffle_options
                      ? 'bg-black'
                      : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.settings.shuffle_options
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Show Results Immediately */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  {formData.settings.show_results_immediately ? (
                    <Eye className="h-5 w-5 text-black" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-black" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">Show Results Immediately</p>
                    <p className="text-sm text-gray-500">
                      Display correct answers after submission
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingToggle('show_results_immediately')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.settings.show_results_immediately
                      ? 'bg-black'
                      : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.settings.show_results_immediately
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Attempts Allowed */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-black" />
                  Attempts Allowed
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleSettingChange('attempts_allowed', num)}
                      className={`flex-1 py-3 rounded-lg font-medium transition-all border ${
                        formData.settings.attempts_allowed === num
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Button */}
            <button onClick={handleNext} className="w-full btn-primary">
              Next: Choose Quiz Method →
            </button>
          </div>
        )}

        {/* Step 2: Choose Quiz Creation Method */}
        {step === 2 && (
          <div className="card max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Quiz Option
              </h2>
              <p className="text-gray-600">
                Select how you want to add a quiz to this room
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Select Existing Quiz Option */}
              <button
                onClick={() => setQuizCreationMethod('existing')}
                className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                  quizCreationMethod === 'existing'
                    ? 'border-black bg-gray-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-black p-3 rounded-lg">
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                  {quizCreationMethod === 'existing' && (
                    <CheckCircle className="h-6 w-6 text-black" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Select Existing Quiz
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose from your previously created quizzes
                </p>

                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-black mt-0.5 flex-shrink-0" />
                    <span>Quick setup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-black mt-0.5 flex-shrink-0" />
                    <span>Use existing quizzes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-black mt-0.5 flex-shrink-0" />
                    <span>Start room instantly</span>
                  </li>
                </ul>
              </button>

              {/* AI Generated Quiz Option */}
              <button
                onClick={() => setQuizCreationMethod('ai')}
                className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                  quizCreationMethod === 'ai'
                    ? 'border-black bg-gray-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-black p-3 rounded-lg">
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                  {quizCreationMethod === 'ai' && (
                    <CheckCircle className="h-6 w-6 text-black" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  AI Generated Quiz
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload documents and let AI generate questions
                </p>

                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-black mt-0.5 flex-shrink-0" />
                    <span>Upload documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-black mt-0.5 flex-shrink-0" />
                    <span>AI generates questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-black mt-0.5 flex-shrink-0" />
                    <span>Edit & customize</span>
                  </li>
                </ul>
              </button>

              {/* Manual Quiz Creation Option */}
              <button
                onClick={() => setQuizCreationMethod('manual')}
                className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                  quizCreationMethod === 'manual'
                    ? 'border-black bg-gray-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-black p-3 rounded-lg">
                    <PenTool className="h-8 w-8 text-white" />
                  </div>
                  {quizCreationMethod === 'manual' && (
                    <CheckCircle className="h-6 w-6 text-black" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Create New Quiz
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Build your quiz from scratch manually
                </p>

                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-black mt-0.5 flex-shrink-0" />
                    <span>Full control</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-black mt-0.5 flex-shrink-0" />
                    <span>Custom questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-black mt-0.5 flex-shrink-0" />
                    <span>Add explanations</span>
                  </li>
                </ul>
              </button>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!quizCreationMethod}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {quizCreationMethod === 'existing' ? 'Next: Select Quiz' : 'Create Quiz'} →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Select Quiz (only for existing quiz option) */}
        {step === 3 && (
          <div className="card max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Quiz
              </h2>
              <p className="text-gray-600">
                Select which quiz participants will take
              </p>
            </div>

            {loadingQuizzes ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
              </div>
            ) : quizzes.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No quizzes available
                </h3>
                <p className="text-gray-500 mb-4">
                  Create a quiz first before creating a room
                </p>
                <button
                  onClick={() => navigate('/generate')}
                  className="btn-primary inline-block"
                >
                  Generate Quiz
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {quizzes.map((quiz) => (
                    <button
                      key={quiz.id}
                      onClick={() =>
                        setFormData({ ...formData, quiz_id: quiz.id })
                      }
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        formData.quiz_id === quiz.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {quiz.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {quiz.questions?.length || 0} questions
                          </p>
                        </div>
                        {formData.quiz_id === quiz.id && (
                          <CheckCircle className="h-6 w-6 text-purple-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 btn-secondary"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={loading || !formData.quiz_id}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                        Creating...
                      </>
                    ) : (
                      'Create Room'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
