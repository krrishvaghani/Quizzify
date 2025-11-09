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
} from 'lucide-react'
import AnimatedTabs from '../components/AnimatedTabs'

export default function QuizGenerator() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [numQuestions, setNumQuestions] = useState(5)
  const [difficulty, setDifficulty] = useState('medium')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
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
        difficulty
      )
      
      clearInterval(progressInterval)
      setProgress(100)
      
      // If coming from Create Room flow, create room and navigate to it
      if (returnTo === 'create-room' && roomData) {
        try {
          // Create room with the generated quiz
          const roomResult = await roomAPI.createRoom({
            ...roomData,
            quiz_id: result.quiz.id
          })
          
          setTimeout(() => {
            navigate(`/room/${roomResult.room.id}`)
          }, 500)
        } catch (roomError) {
          console.error('Error creating room:', roomError)
          alert('Quiz created but failed to create room. You can create a room manually from the dashboard.')
          setTimeout(() => {
            navigate(`/quiz/${result.quiz.id}`)
          }, 500)
        }
      } else {
        // Normal flow - navigate to quiz view
        setTimeout(() => {
          navigate(`/quiz/${result.quiz.id}`)
        }, 500)
      }
    } catch (error) {
      clearInterval(progressInterval)
      console.error('Error generating quiz:', error)
      alert(error.response?.data?.detail || 'Failed to generate quiz. Please try again.')
      setProgress(0)
    } finally {
      setLoading(false)
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-black via-gray-900 to-black text-white border-b border-gray-800 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <button
            onClick={() => navigate(returnTo === 'create-room' ? '/create-room' : '/dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-xl transition-all font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-black" />
            </div>
            <span className="text-white font-black text-xl">QUIZZIFY</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Create Room Mode Banner */}
        {returnTo === 'create-room' && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-lg">Creating Room: {roomData?.title}</h3>
                <p className="text-sm text-gray-700 font-medium mt-1">
                  Generate a quiz to use in your room. After generation, the room will be created automatically.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center shadow-2xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-black mb-3">
            Generate Quiz with AI
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Upload your document and let AI create engaging quizzes instantly
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-10 max-w-3xl mx-auto">
          {/* File Upload Area */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Upload Document
            </label>
            
            <div
              className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all ${
                selectedFile
                  ? 'border-black bg-gradient-to-br from-green-50 to-blue-50'
                  : 'border-gray-300 hover:border-black bg-gradient-to-br from-gray-50 to-gray-100'
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
                {selectedFile ? getFileIcon() : <Upload className="h-16 w-16 text-gray-400 mb-6" />}
                
                {selectedFile ? (
                  <div className="mt-4">
                    <p className="text-xl font-black text-gray-900 mb-2">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-600 font-semibold">
                      {formatFileSize(selectedFile.size)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedFile(null)
                      }}
                      className="mt-4 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-xl font-black text-gray-900 mb-3">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-base text-gray-600 font-medium">
                      PDF, PPT, PPTX, DOC, DOCX, or TXT (Max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-8 mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">Quiz Settings</h3>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-900 mb-4">
                Number of Questions: <span className="text-2xl text-black">{numQuestions}</span>
              </label>
              <input
                type="range"
                min="3"
                max="20"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full appearance-none cursor-pointer accent-black"
                disabled={loading}
              />
              <div className="flex justify-between text-sm font-bold text-gray-500 mt-2">
                <span>3 Questions</span>
                <span>20 Questions</span>
              </div>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-900 mb-4">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    disabled={loading}
                    className={`py-4 px-6 rounded-xl font-bold capitalize transition-all text-lg ${
                      difficulty === level
                        ? 'bg-gradient-to-r from-black to-gray-800 text-white shadow-lg scale-105'
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 border-2 border-gray-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="mb-8 p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-2xl border-2 border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  Generating quiz...
                </span>
                <span className="text-lg font-black text-gray-900 bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1 rounded-full">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-4 rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!selectedFile || loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-black via-gray-900 to-black text-white rounded-2xl font-black text-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl border-2 border-gray-800"
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
          <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-gray-200 rounded-2xl shadow-lg">
            <p className="text-sm font-semibold text-gray-800 leading-relaxed">
              <strong className="text-gray-900 text-base">💡 Tip:</strong> For best results, upload documents with clear,
              well-structured content. The AI will analyze your document and generate
              relevant multiple-choice questions.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
