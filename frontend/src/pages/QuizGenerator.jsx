import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { quizAPI, roomAPI } from '../utils/api'
import {
  Upload,
  FileText,
  File,
  FileSpreadsheet,
  Loader2,
  CheckCircle,
  ArrowLeft,
  Settings,
  Home,
  BarChart3,
  Plus,
  PlusCircle,
  Users,
  Sparkles,
  Eye,
  Target,
  PlayCircle,
  BookOpen,
} from 'lucide-react'
import AnimatedTabs from '../components/AnimatedTabs'

export default function QuizGenerator() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [quizName, setQuizName] = useState('')
  const [numQuestions, setNumQuestions] = useState(5)
  const [difficulty, setDifficulty] = useState('medium')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedQuiz, setGeneratedQuiz] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
  // Check if we're coming from Create Room flow
  const returnTo = location.state?.returnTo
  const roomData = location.state?.roomData

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain',
      ]
      
      if (validTypes.includes(file.type) || file.name.match(/\.(pdf|pptx?|docx?|txt)$/i)) {
        setSelectedFile(file)
      } else {
        alert('Please upload a valid file (PDF, PPT, PPTX, DOC, DOCX, or TXT)')
      }
    }
  }

  const handleGenerate = async () => {
    if (!selectedFile) {
      alert('Please select a file first')
      return
    }

    if (!quizName.trim()) {
      alert('Please enter a quiz name')
      return
    }

    setLoading(true)
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 300)

    try {
      const result = await quizAPI.uploadAndGenerate(
        selectedFile,
        numQuestions,
        difficulty,
        quizName
      )
      
      clearInterval(progressInterval)
      setProgress(100)
      
      // Store the generated quiz
      setGeneratedQuiz(result.quiz)
      
      // Show success modal
      setTimeout(() => {
        setShowSuccessModal(true)
        setLoading(false)
      }, 500)
      
    } catch (error) {
      clearInterval(progressInterval)
      console.error('Error generating quiz:', error)
      alert(error.response?.data?.detail || 'Failed to generate quiz. Please try again.')
      setProgress(0)
      setLoading(false)
    }
  }
  
  const handleViewQuiz = () => {
    if (generatedQuiz) {
      navigate(`/quiz/${generatedQuiz.id}`)
    }
  }
  
  const handleStartQuiz = () => {
    if (generatedQuiz) {
      navigate(`/quiz/${generatedQuiz.id}/start`)
    }
  }
  
  const handleBackToDashboard = () => {
    navigate('/dashboard')
  }
  
  const handleCreateAnother = () => {
    setGeneratedQuiz(null)
    setShowSuccessModal(false)
    setSelectedFile(null)
    setQuizName('')
    setProgress(0)
  }

  const getFileIcon = () => {
    if (!selectedFile) return <File className="h-12 w-12 text-gray-400" />
    
    const name = selectedFile.name.toLowerCase()
    if (name.endsWith('.pdf')) return <FileText className="h-12 w-12 text-red-500" />
    if (name.match(/\.(pptx?|ppt)$/)) return <FileSpreadsheet className="h-12 w-12 text-orange-500" />
    if (name.match(/\.(docx?|doc)$/)) return <FileText className="h-12 w-12 text-blue-500" />
    return <FileText className="h-12 w-12 text-gray-500" />
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Header Bar */}
      <header className="bg-[#1a1f2e] border-b border-[#2d3548] sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(returnTo === 'create-room' ? '/create-room' : '/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-all font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Create Room Mode Banner */}
        {returnTo === 'create-room' && (
          <div className="mb-6 bg-[#1a1f2e] border-2 border-cyan-500/30 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Creating Room: {roomData?.title}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Generate a quiz to use in your room.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Generate Quiz with AI
          </h1>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Upload your document and let AI create engaging quizzes instantly
          </p>
        </div>

        <div className="bg-[#1a1f2e] rounded-2xl shadow-2xl border-2 border-[#2d3548] p-8">
          {/* File Upload Area */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-white mb-3">
              Upload Document
            </label>
            
            <div
              className={`relative border-3 border-dashed rounded-xl p-12 text-center transition-all ${
                selectedFile
                  ? 'border-cyan-500 bg-[#252b3b]'
                  : 'border-[#2d3548] hover:border-cyan-500 bg-[#252b3b]'
              }`}
            >
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.ppt,.pptx,.doc,.docx,.txt"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />
              
              <div className="flex flex-col items-center">
                {selectedFile ? getFileIcon() : <Upload className="h-16 w-16 text-gray-400 mb-4" />}
                
                {selectedFile ? (
                  <div className="mt-4">
                    <p className="text-lg font-bold text-white mb-2">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-400 font-medium mb-4">
                      {formatFileSize(selectedFile.size)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedFile(null)
                      }}
                      className="px-5 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-bold text-white mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-400">
                      PDF, PPT, PPTX, DOC, DOCX, or TXT (Max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Quiz Settings</h3>
            </div>

            {/* Quiz Name Input */}
            <div>
              <label className="block text-sm font-bold text-white mb-3">
                Quiz Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                placeholder="Enter a name for your quiz..."
                disabled={loading}
                className="w-full px-4 py-3 bg-[#252b3b] border-2 border-[#2d3548] rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-2">
                Give your quiz a descriptive name (e.g., "Chapter 5: Photosynthesis Quiz")
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-4">
                Number of Questions: <span className="text-xl text-cyan-400">{numQuestions}</span>
              </label>
              <input
                type="range"
                min="3"
                max="20"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full h-2 bg-[#2d3548] rounded-full appearance-none cursor-pointer accent-cyan-500"
                disabled={loading}
              />
              <div className="flex justify-between text-xs font-semibold text-gray-400 mt-2">
                <span>3 Questions</span>
                <span>20 Questions</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-4">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    disabled={loading}
                    className={`py-3 px-6 rounded-xl font-bold capitalize transition-all text-base ${
                      difficulty === level
                        ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white shadow-xl scale-105'
                        : 'bg-[#252b3b] text-gray-400 hover:bg-[#2d3548] hover:text-white border-2 border-[#2d3548]'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="mb-6 p-5 bg-[#252b3b] rounded-xl border-2 border-[#2d3548] shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-white flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                  Generating quiz...
                </span>
                <span className="text-lg font-bold text-cyan-400 bg-[#1a1f2e] px-4 py-1.5 rounded-lg">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-[#1a1f2e] rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!selectedFile || loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl mb-6"
          >
            {loading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <CheckCircle className="h-6 w-6" />
                Generate Quiz
              </>
            )}
          </button>

          {/* Info */}
          <div className="p-5 bg-[#252b3b] border-2 border-[#2d3548] rounded-xl">
            <p className="text-sm text-gray-400 leading-relaxed">
              <strong className="text-cyan-400 text-base">💡 Tip:</strong> For best results, upload documents with clear,
              well-structured content. The AI will analyze your document and generate
              relevant multiple-choice questions.
            </p>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && generatedQuiz && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1f2e] rounded-2xl border-2 border-cyan-500/30 max-w-2xl w-full mx-auto shadow-2xl animate-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Quiz Generated Successfully! 🎉
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Your AI-powered quiz is ready
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Quiz Info */}
              <div className="bg-[#252b3b] rounded-xl p-4 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-cyan-400" />
                  {generatedQuiz.title}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FileText className="h-4 w-4 text-cyan-400" />
                    <span>{generatedQuiz.questions?.length || 0} Questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Target className="h-4 w-4 text-purple-400" />
                    <span className="capitalize">{difficulty} Difficulty</span>
                  </div>
                </div>
              </div>

              {/* Sample Questions Preview */}
              <div className="bg-[#252b3b] rounded-xl p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-white mb-3">Sample Questions:</h4>
                <div className="space-y-2 text-sm">
                  {generatedQuiz.questions?.slice(0, 3).map((q, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">{idx + 1}.</span>
                      <span className="text-gray-300 line-clamp-1">{q.question}</span>
                    </div>
                  ))}
                  {generatedQuiz.questions?.length > 3 && (
                    <p className="text-gray-500 text-xs italic pl-5">
                      +{generatedQuiz.questions.length - 3} more questions...
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleViewQuiz}
                  className="py-3 px-4 bg-[#252b3b] hover:bg-[#2d3548] text-white rounded-lg font-semibold transition-all border-2 border-gray-700 hover:border-cyan-500 flex items-center justify-center gap-2"
                >
                  <Eye className="h-5 w-5" />
                  View Quiz
                </button>
                <button
                  onClick={handleStartQuiz}
                  className="py-3 px-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:opacity-90 text-white rounded-lg font-bold transition-opacity flex items-center justify-center gap-2 shadow-lg"
                >
                  <PlayCircle className="h-5 w-5" />
                  Start Quiz
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreateAnother}
                  className="flex-1 py-2.5 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Another
                </button>
                <button
                  onClick={handleBackToDashboard}
                  className="flex-1 py-2.5 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
