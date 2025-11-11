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
  Home,
  BarChart3,
  Plus,
  PlusCircle,
} from 'lucide-react'
import AnimatedTabs from '../components/AnimatedTabs'

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
      enable_timer: true,
      timer_duration: 30,
      shuffle_questions: true,
      shuffle_options: true,
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
    <div className="min-h-screen bg-[#0f1419]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1a1f2e] to-[#252b3b] text-white border-b border-gray-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 text-base font-bold hover:scale-105 transition-all duration-200"
          >
            <ArrowLeft className="h-6 w-6" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-6">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">
            Create a Room
          </h1>
          <p className="text-lg text-gray-400 font-semibold">
            Set up a quiz room for students to join and compete
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10 p-6 bg-[#1a1f2e] rounded-2xl shadow-xl border border-gray-800">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-14 h-14 rounded-xl font-bold text-lg transition-all duration-300 ${
                    s <= step
                      ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white shadow-lg scale-110'
                      : 'bg-[#252b3b] text-gray-500 border border-gray-700'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-20 h-1.5 mx-3 rounded-full transition-all duration-300 ${
                      s < step ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-20 mt-4 text-sm font-bold text-gray-400">
            <p>Details</p>
            <p>Quiz</p>
            <p>Settings</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-500/10 border-2 border-red-500/30 text-red-400 px-6 py-4 rounded-xl flex items-center gap-3 shadow-lg font-semibold">
            <AlertCircle className="h-6 w-6" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Room Details & Settings */}
        {step === 1 && (
          <div className="bg-[#1a1f2e] p-10 rounded-2xl shadow-2xl border border-gray-800 max-w-3xl mx-auto space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <SettingsIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">
                  Room Details & Settings
                </h2>
              </div>
              <p className="text-gray-400 ml-15 font-semibold">Configure your quiz room</p>
            </div>

            {/* Room Title */}
            <div>
              <label className="block text-base font-bold text-white mb-3">
                Room Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Math Quiz Championship"
                className="w-full px-5 py-4 bg-[#252b3b] border-2 border-gray-700 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all duration-200 font-semibold text-white placeholder-gray-500"
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-base font-bold text-white mb-3">
                Description <span className="text-gray-500 font-semibold">(Optional)</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your quiz room..."
                rows={3}
                className="w-full px-5 py-4 bg-[#252b3b] border-2 border-gray-700 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all duration-200 font-semibold text-white placeholder-gray-500 resize-none"
                maxLength={500}
              />
            </div>

            {/* Quiz Features */}
            <div className="border-t-2 border-gray-800 pt-8">
              <h3 className="text-2xl font-black text-white mb-6">
                Quiz Features
              </h3>

              {/* Enable Timer */}
              <div className="mb-6">
                <div className="flex items-center justify-between p-6 bg-[#252b3b] rounded-2xl border-2 border-gray-700 shadow-lg hover:border-cyan-500/50 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">Enable Timer</p>
                      <p className="text-sm text-gray-400 font-semibold">
                        Set time limit per question
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingToggle('enable_timer')}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 shadow-lg ${
                      formData.settings.enable_timer
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600'
                        : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                        formData.settings.enable_timer
                          ? 'translate-x-7'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {formData.settings.enable_timer && (
                  <div className="mt-4 ml-8 p-6 bg-[#1a1f2e] rounded-2xl border-2 border-gray-700 shadow-md">
                    <label className="block text-base font-bold text-white mb-3">
                      Timer Duration: <span className="text-cyan-400">{formData.settings.timer_duration}s</span>
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
                      className="w-full h-3 bg-gray-700 rounded-full appearance-none cursor-pointer accent-cyan-500 shadow-inner"
                    />
                    <div className="flex justify-between text-xs font-bold text-gray-400 mt-2">
                      <span>15s</span>
                      <span>5min</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Shuffle Questions */}
              <div className="flex items-center justify-between p-6 bg-[#252b3b] rounded-2xl mb-6 border-2 border-gray-700 shadow-lg hover:border-green-500/50 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <Shuffle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">Shuffle Questions</p>
                    <p className="text-sm text-gray-400 font-semibold">
                      Randomize question order
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingToggle('shuffle_questions')}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 shadow-lg ${
                    formData.settings.shuffle_questions
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                      : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                      formData.settings.shuffle_questions
                        ? 'translate-x-7'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Shuffle Options */}
              <div className="flex items-center justify-between p-6 bg-[#252b3b] rounded-2xl mb-6 border-2 border-gray-700 shadow-lg hover:border-purple-500/50 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                    <RotateCw className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">Shuffle Options</p>
                    <p className="text-sm text-gray-400 font-semibold">
                      Randomize answer options
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingToggle('shuffle_options')}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 shadow-lg ${
                    formData.settings.shuffle_options
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                      : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                      formData.settings.shuffle_options
                        ? 'translate-x-7'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Show Results Immediately */}
              <div className="flex items-center justify-between p-6 bg-[#252b3b] rounded-2xl mb-6 border-2 border-gray-700 shadow-lg hover:border-yellow-500/50 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg">
                    {formData.settings.show_results_immediately ? (
                      <Eye className="h-6 w-6 text-white" />
                    ) : (
                      <EyeOff className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">Show Results Immediately</p>
                    <p className="text-sm text-gray-400 font-semibold">
                      Display correct answers after submission
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingToggle('show_results_immediately')}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 shadow-lg ${
                    formData.settings.show_results_immediately
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-600'
                      : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                      formData.settings.show_results_immediately
                        ? 'translate-x-7'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Attempts Allowed */}
              <div className="p-6 bg-[#252b3b] rounded-2xl border-2 border-gray-700 shadow-lg">
                <label className="block text-base font-bold text-white mb-4 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  Attempts Allowed
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleSettingChange('attempts_allowed', num)}
                      className={`flex-1 py-4 rounded-2xl font-black text-lg transition-all duration-200 border-2 shadow-lg hover:scale-105 ${
                        formData.settings.attempts_allowed === num
                          ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white border-cyan-500 scale-105 shadow-cyan-500/30'
                          : 'bg-[#1a1f2e] text-gray-400 hover:text-white border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Button */}
            <button onClick={handleNext} className="w-full py-5 px-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-2xl font-black text-xl hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 shadow-2xl hover:shadow-cyan-500/30 border-2 border-cyan-500">
              Next: Choose Quiz Method 
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>
        )}

        {/* Step 2: Choose Quiz Creation Method */}
        {step === 2 && (
          <div className="bg-[#1a1f2e] p-10 rounded-2xl shadow-2xl border border-gray-800 max-w-6xl mx-auto">
            <div className="mb-10 text-center">
              <h2 className="text-4xl font-bold text-white mb-3">
                Choose Quiz Option
              </h2>
              <p className="text-lg text-gray-400 font-semibold">
                Select how you want to add a quiz to this room
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Select Existing Quiz Option */}
              <button
                onClick={() => setQuizCreationMethod('existing')}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                  quizCreationMethod === 'existing'
                    ? 'border-cyan-500 bg-cyan-500/10 scale-105 shadow-lg shadow-cyan-500/20'
                    : 'border-gray-700 bg-[#252b3b] hover:border-cyan-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Bot className="h-7 w-7 text-white" />
                  </div>
                  {quizCreationMethod === 'existing' && (
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  Select Existing Quiz
                </h3>
                <p className="text-sm text-gray-400 mb-6 font-semibold">
                  Choose from your previously created quizzes
                </p>

                <ul className="space-y-3 text-sm text-gray-300 font-semibold">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Quick setup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Use existing quizzes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>Start room instantly</span>
                  </li>
                </ul>
              </button>

              {/* AI Generated Quiz Option */}
              <button
                onClick={() => setQuizCreationMethod('ai')}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                  quizCreationMethod === 'ai'
                    ? 'border-green-500 bg-green-500/10 scale-105 shadow-lg shadow-green-500/20'
                    : 'border-gray-700 bg-[#252b3b] hover:border-green-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Bot className="h-7 w-7 text-white" />
                  </div>
                  {quizCreationMethod === 'ai' && (
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  AI Generated Quiz
                </h3>
                <p className="text-sm text-gray-400 mb-6 font-semibold">
                  Upload documents and let AI generate questions
                </p>

                <ul className="space-y-3 text-sm text-gray-300 font-semibold">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Upload documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>AI generates questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Edit & customize</span>
                  </li>
                </ul>
              </button>

              {/* Manual Quiz Creation Option */}
              <button
                onClick={() => setQuizCreationMethod('manual')}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                  quizCreationMethod === 'manual'
                    ? 'border-purple-500 bg-purple-500/10 scale-105 shadow-lg shadow-purple-500/20'
                    : 'border-gray-700 bg-[#252b3b] hover:border-purple-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <PenTool className="h-7 w-7 text-white" />
                  </div>
                  {quizCreationMethod === 'manual' && (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  )}
                </div>

                <h3 className="text-xl font-black text-white mb-3">
                  Create New Quiz
                </h3>
                <p className="text-sm text-gray-600 mb-6 font-semibold">
                  Build your quiz from scratch manually
                </p>

                <ul className="space-y-3 text-sm text-gray-700 font-semibold">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Full control</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Custom questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Add explanations</span>
                  </li>
                </ul>
              </button>
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={() => setStep(1)}
                className="px-8 py-4 bg-[#252b3b] text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-200 flex items-center gap-3 shadow-lg border-2 border-gray-700 hover:border-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!quizCreationMethod}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-2xl font-black text-lg hover:scale-105 transition-all duration-200 flex items-center gap-3 shadow-2xl hover:shadow-cyan-500/30 border-2 border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {quizCreationMethod === 'existing' ? 'Next: Select Quiz' : 'Create Quiz'} 
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Select Quiz (only for existing quiz option) */}
        {step === 3 && (
          <div className="bg-[#1a1f2e] p-10 rounded-2xl shadow-2xl border border-gray-800 max-w-2xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-black text-white mb-3">
                Choose Quiz
              </h2>
              <p className="text-lg text-gray-400 font-semibold">
                Select which quiz participants will take
              </p>
            </div>

            {loadingQuizzes ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-12 w-12 text-cyan-400 animate-spin" />
              </div>
            ) : quizzes.length === 0 ? (
              <div className="text-center py-16 bg-[#252b3b] rounded-2xl border-2 border-gray-700">
                <AlertCircle className="h-20 w-20 text-gray-500 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-white mb-3">
                  No quizzes available
                </h3>
                <p className="text-gray-400 mb-6 font-semibold text-lg">
                  Create a quiz first before creating a room
                </p>
                <button
                  onClick={() => navigate('/generate')}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-2xl font-black text-lg hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-cyan-500/30 border-2 border-cyan-500 inline-flex items-center gap-3"
                >
                  <Plus className="h-6 w-6" />
                  Generate Quiz
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-8 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                  {quizzes.map((quiz) => (
                    <button
                      key={quiz.id}
                      onClick={() =>
                        setFormData({ ...formData, quiz_id: quiz.id })
                      }
                      className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 shadow-lg hover:scale-[1.02] ${
                        formData.quiz_id === quiz.id
                          ? 'border-cyan-500 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 scale-[1.02] shadow-cyan-500/20'
                          : 'border-gray-700 hover:border-gray-600 bg-[#252b3b]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-black text-white mb-2 text-xl">
                            {quiz.title}
                          </h3>
                          <p className="text-sm text-gray-400 font-bold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-3 py-1 rounded-full inline-block border border-cyan-500/30">
                            {quiz.questions?.length || 0} questions
                          </p>
                        </div>
                        {formData.quiz_id === quiz.id && (
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 px-6 py-4 bg-[#252b3b] text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-200 shadow-lg border-2 border-gray-700 hover:border-gray-600 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={loading || !formData.quiz_id}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-2xl font-black text-lg hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-cyan-500/30 border-2 border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
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


