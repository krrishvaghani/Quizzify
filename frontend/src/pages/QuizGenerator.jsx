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
} from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(returnTo === 'create-room' ? '/create-room' : '/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to {returnTo === 'create-room' ? 'Create Room' : 'Dashboard'}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Create Room Mode Banner */}
        {returnTo === 'create-room' && (
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Creating Room: {roomData?.title}</h3>
                <p className="text-sm text-gray-600">
                  Generate a quiz to use in your room. After generation, the room will be created automatically.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Generate Quiz
          </h1>
          <p className="text-lg text-gray-600">
            Upload your document and let AI create engaging quizzes
          </p>
        </div>

        <div className="card max-w-2xl mx-auto">
          {/* File Upload Area */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Upload Document
            </label>
            
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                selectedFile
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400 bg-gray-50'
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
                {selectedFile ? getFileIcon() : <Upload className="h-12 w-12 text-gray-400 mb-4" />}
                
                {selectedFile ? (
                  <div className="mt-4">
                    <p className="text-lg font-semibold text-gray-900 mb-1">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedFile(null)
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-700"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, PPT, PPTX, DOC, DOCX, or TXT (Max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Quiz Settings</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions: {numQuestions}
              </label>
              <input
                type="range"
                min="3"
                max="20"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                disabled={loading}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>3</span>
                <span>20</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    disabled={loading}
                    className={`py-3 px-4 rounded-lg font-medium capitalize transition-all ${
                      difficulty === level
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Generating quiz...
                </span>
                <span className="text-sm font-medium text-primary-600">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!selectedFile || loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                Generate Quiz
              </>
            )}
          </button>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> For best results, upload documents with clear,
              well-structured content. The AI will analyze your document and generate
              relevant multiple-choice questions.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
