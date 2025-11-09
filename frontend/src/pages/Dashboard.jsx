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
  Eye,
} from 'lucide-react';
import AnimatedTabs from '../components/AnimatedTabs';

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
    <div className="min-h-screen bg-white">
      <header className="bg-black text-white border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-7 w-7" />
              <h1 className="text-2xl font-bold">Quizzify</h1>
            </div>

            <div className="flex items-center gap-6">
              <AnimatedTabs
                tabs={[
                  { label: 'Dashboard', value: 'dashboard' },
                  { label: 'Create Quiz', value: 'generate' },
                  { label: 'Room', value: 'create-room' },
                  { label: 'Rooms', value: 'rooms' },
                  { label: 'Analytics', value: 'analytics' }
                ]}
                variant="underline"
                activeTab="dashboard"
                isDark={true}
                onTabChange={(value) => navigate(`/${value}`)}
              />
              
              <div className="border-l border-gray-700 pl-3 ml-3 flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-white hover:bg-gray-900 rounded-lg px-4 py-2.5 text-base font-medium"
                >
                  <User className="h-5 w-5" />
                  <span>{user?.username || 'User'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-white hover:bg-gray-900 rounded-lg"
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-black mb-1">
              Hey {user?.username || 'there'}
            </h2>
            <p className="text-gray-600">Here's what's happening with your quizzes</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/generate"
              className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Generate with AI
            </Link>
            <Link
              to="/create-manual-quiz"
              className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-50 border border-gray-300 flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Create Manual
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Quizzes</p>
                <p className="text-3xl font-bold text-black">{quizzes.length}</p>
                <p className="text-xs text-gray-400 mt-1">quizzes created</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <BookOpen className="h-7 w-7 text-black" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Questions</p>
                <p className="text-3xl font-bold text-black">{getTotalQuestions()}</p>
                <p className="text-xs text-gray-400 mt-1">across all quizzes</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <Target className="h-7 w-7 text-black" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">This Month</p>
                <p className="text-3xl font-bold text-black">
                  {quizzes.filter((q) => {
                    const quizDate = new Date(q.created_at);
                    const now = new Date();
                    return (
                      quizDate.getMonth() === now.getMonth() &&
                      quizDate.getFullYear() === now.getFullYear()
                    );
                  }).length}
                </p>
                <p className="text-xs text-gray-400 mt-1">quizzes created</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <Calendar className="h-7 w-7 text-black" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-black mb-4">Quick stuff</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              to="/generate"
              className="flex flex-col items-center gap-2 p-4 bg-black text-white rounded-lg hover:bg-gray-800 border border-black"
            >
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium">AI Generate</span>
            </Link>
            <Link
              to="/create-manual-quiz"
              className="flex flex-col items-center gap-2 p-4 bg-gray-100 rounded-lg hover:bg-gray-200 border border-gray-200"
            >
              <Edit3 className="h-5 w-5 text-black" />
              <span className="text-sm font-medium text-black">Manual Create</span>
            </Link>
            <Link
              to="/create-room"
              className="flex flex-col items-center gap-2 p-4 bg-gray-100 rounded-lg hover:bg-gray-200 border border-gray-200"
            >
              <PlusCircle className="h-5 w-5 text-black" />
              <span className="text-sm font-medium text-black">New Room</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-black">Your Quizzes</h2>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {quizzes.length} total
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-3" />
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-16 px-6">
              <FileText className="h-12 w-12 text-gray-300 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-black mb-2">
                No quizzes yet
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Create your first quiz with AI or build one yourself
              </p>
              <div className="flex gap-3 justify-center">
                <Link 
                  to="/generate" 
                  className="px-5 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 flex items-center gap-2 border border-black"
                >
                  <Sparkles className="h-4 w-4" />
                  AI Generate
                </Link>
                <Link 
                  to="/create-manual-quiz" 
                  className="px-5 py-2 bg-white text-black rounded-lg font-medium border border-gray-300 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Create Yourself
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-black mb-1">
                        {quiz.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{quiz.questions?.length || 0} questions</span>
                        <span>•</span>
                        <span>{formatDate(quiz.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/quiz/${quiz.id}`}
                        className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2 text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(quiz.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
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
