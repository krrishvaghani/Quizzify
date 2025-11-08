import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizAPI } from '../utils/api';
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
  BarChart3,
  Edit3,
  Sparkles,
  Target,
} from 'lucide-react';

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const data = await quizAPI.getQuizzes();
      setQuizzes(data.quizzes || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    try {
      await quizAPI.deleteQuiz(id);
      setQuizzes(quizzes.filter((q) => q.id !== id));
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Failed to delete quiz');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTotalQuestions = () => {
    return quizzes.reduce((sum, quiz) => sum + (quiz.questions?.length || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gray-900 p-2.5 rounded-lg">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quizzify</h1>
                <p className="text-sm text-gray-500">Professional Quiz Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg transition-colors"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                to="/analytics"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Analytics</span>
              </Link>
              <Link
                to="/generate"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">Create Quiz</span>
              </Link>
              <Link
                to="/create-room"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
              >
                <PlusCircle className="h-5 w-5" />
                <span className="font-medium">Room</span>
              </Link>
              <Link
                to="/rooms"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
              >
                <Users className="h-5 w-5" />
                <span className="font-medium">Rooms</span>
              </Link>
              
              <div className="border-l-2 border-gray-300 pl-3 ml-3 flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user?.username || 'User'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.username || 'Teacher'}
              </h2>
              <p className="text-gray-600">Manage your quizzes and track student performance</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/generate"
                className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Sparkles className="h-5 w-5" />
                Generate with AI
              </Link>
              <Link
                to="/create-manual-quiz"
                className="px-5 py-2.5 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-300 flex items-center gap-2"
              >
                <Edit3 className="h-5 w-5" />
                Manual Create
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Total Quizzes</p>
                <p className="text-3xl font-bold text-gray-900">{quizzes.length}</p>
                <p className="text-sm text-gray-500 mt-2">All created quizzes</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <BookOpen className="h-8 w-8 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Total Questions</p>
                <p className="text-3xl font-bold text-gray-900">{getTotalQuestions()}</p>
                <p className="text-sm text-gray-500 mt-2">Across all quizzes</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <Target className="h-8 w-8 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">This Month</p>
                <p className="text-3xl font-bold text-gray-900">
                  {quizzes.filter((q) => {
                    const quizDate = new Date(q.created_at);
                    const now = new Date();
                    return (
                      quizDate.getMonth() === now.getMonth() &&
                      quizDate.getFullYear() === now.getFullYear()
                    );
                  }).length}
                </p>
                <p className="text-sm text-gray-500 mt-2">Created this month</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <Calendar className="h-8 w-8 text-gray-700" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/generate"
              className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <div className="p-3 bg-gray-900 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">AI Generate</span>
            </Link>
            <Link
              to="/create-manual-quiz"
              className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <div className="p-3 bg-gray-900 rounded-lg">
                <Edit3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Manual Create</span>
            </Link>
            <Link
              to="/create-room"
              className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <div className="p-3 bg-gray-900 rounded-lg">
                <PlusCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">New Room</span>
            </Link>
            <Link
              to="/analytics"
              className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <div className="p-3 bg-gray-900 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">View Analytics</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Your Quizzes
              </h2>
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                {quizzes.length} Total
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 text-gray-400 animate-spin mb-4" />
              <p className="text-gray-600">Loading your quizzes...</p>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-6">
                <FileText className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No quizzes yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start creating quizzes with AI or build them manually from scratch
              </p>
              <div className="flex gap-3 justify-center">
                <Link 
                  to="/generate" 
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Generate with AI
                </Link>
                <Link 
                  to="/create-manual-quiz" 
                  className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Edit3 className="h-5 w-5" />
                  Manual Create
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="px-6 py-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex items-center gap-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <BookOpen className="h-6 w-6 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {quiz.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-gray-600">
                            <Target className="h-4 w-4" />
                            <span className="font-medium">{quiz.questions?.length || 0}</span> questions
                          </span>
                          <span className="flex items-center gap-1 text-gray-500">
                            <Calendar className="h-4 w-4" />
                            {formatDate(quiz.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/quiz/${quiz.id}`}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"
                      >
                        <FileText className="h-4 w-4" />
                        View
                      </Link>
                      <Link
                        to={`/quiz/${quiz.id}/analytics`}
                        className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                      >
                        <BarChart3 className="h-4 w-4" />
                        Analytics
                      </Link>
                      <button
                        onClick={() => handleDelete(quiz.id)}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                        title="Delete Quiz"
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
  );
}
