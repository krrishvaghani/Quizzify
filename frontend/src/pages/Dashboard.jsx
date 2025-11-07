import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { quizAPI } from '../utils/api'
import {
  BookOpen,
  Plus,
  FileText,
  Calendar,
  Trash2,
  LogOut,
  User,
  Loader2,
  Users,
  Home,
  PlusCircle,
  Share2,
  Check,
  Download,
  Edit3,
} from 'lucide-react'

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedQuizId, setCopiedQuizId] = useState(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      const data = await quizAPI.getQuizzes()
      setQuizzes(data.quizzes || [])
    } catch (error) {
      console.error('Error fetching quizzes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) {
      return
    }

    try {
      await quizAPI.deleteQuiz(id)
      setQuizzes(quizzes.filter((q) => q.id !== id))
    } catch (error) {
      console.error('Error deleting quiz:', error)
      alert('Failed to delete quiz')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quizzify</h1>
                <p className="text-sm text-gray-500">AI-Powered Quiz Generator</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                to="/generate"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
              >
                <FileText className="h-5 w-5" />
                <span className="font-medium">Create Quiz</span>
              </Link>
              <Link
                to="/create-room"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors"
              >
                <PlusCircle className="h-5 w-5" />
                <span className="font-medium">Create Room</span>
              </Link>
              <Link
                to="/rooms"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
              >
                <Users className="h-5 w-5" />
                <span className="font-medium">Rooms</span>
              </Link>
              
              <div className="border-l pl-3 ml-3 flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-purple-700 hover:bg-purple-50 rounded-lg px-3 py-2 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user?.username || 'User'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Quizzes</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {quizzes.length}
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Questions</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {quizzes.reduce((acc, q) => acc + (q.questions?.length || 0), 0)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {quizzes.filter((q) => {
                    const quizDate = new Date(q.created_at)
                    const now = new Date()
                    return (
                      quizDate.getMonth() === now.getMonth() &&
                      quizDate.getFullYear() === now.getFullYear()
                    )
                  }).length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quizzes List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Quizzes</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No quizzes yet
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by generating your first quiz
              </p>
              <Link to="/generate" className="btn-primary inline-block">
                Generate Quiz
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {quiz.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {quiz.questions?.length || 0} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(quiz.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/quiz/${quiz.id}`}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(quiz.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
