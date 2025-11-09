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
  Edit3,
  Sparkles,
  Target,
  Eye,
  Search,
  Clock,
  CheckCircle2,
  PlayCircle,
  Trophy,
  X,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import AnimatedTabs from '../components/AnimatedTabs';

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
    fetchRecentAttempts();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const data = await quizAPI.getAllPublicQuizzes();
      setQuizzes(data.quizzes || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentAttempts = async () => {
    try {
      console.log('📊 Fetching recent attempts...');
      const data = await quizAPI.getMyAttempts();
      console.log('✅ Recent attempts data:', data);
      setRecentAttempts(data.attempts?.slice(0, 5) || []);
      console.log('📋 Set recent attempts:', data.attempts?.slice(0, 5) || []);
    } catch (error) {
      console.error('❌ Error fetching recent attempts:', error);
      console.error('Error details:', error.response?.data || error.message);
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

  const getQuizCategory = (quiz) => {
    if (quiz.topic) return quiz.topic;
    if (quiz.title?.toLowerCase().includes('academic')) return 'Academic Quiz';
    return 'Custom Topic';
  };

  const getQuizTimeLimit = (quiz) => {
    if (quiz.time_limit) return `${quiz.time_limit} Minutes`;
    return 'Custom Time';
  };

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.topic?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-black via-gray-900 to-black border-r border-gray-800 flex flex-col fixed h-screen overflow-hidden shadow-2xl">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800 flex-shrink-0">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="h-6 w-6 text-black" />
            </div>
            <h1 className="text-xl font-black text-white">QUIZZIFY</h1>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-hidden">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-white to-gray-100 text-black rounded-xl font-bold shadow-lg transition-all hover:shadow-xl"
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/generate"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/10 hover:text-white rounded-xl font-semibold transition-all hover:translate-x-1"
          >
            <Sparkles className="h-5 w-5" />
            <span>Create Quiz</span>
          </Link>

          <Link
            to="/create-room"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/10 hover:text-white rounded-xl font-semibold transition-all hover:translate-x-1"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create Room</span>
          </Link>

          <Link
            to="/rooms"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/10 hover:text-white rounded-xl font-semibold transition-all hover:translate-x-1"
          >
            <Users className="h-5 w-5" />
            <span>Rooms</span>
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/10 hover:text-white rounded-xl font-semibold transition-all hover:translate-x-1"
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </Link>
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-800 flex-shrink-0 bg-gradient-to-b from-transparent to-black/30">
          <div className="flex items-center gap-3 mb-3 px-2 bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.username || 'User'}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-100 ml-64">
        <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 bg-gradient-to-r from-black via-gray-900 to-black text-white rounded-3xl p-8 shadow-2xl border border-gray-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-300 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-black" />
            </div>
            <div>
              <h2 className="text-4xl font-black mb-2">
                Welcome back, {user?.username || 'User'}!
              </h2>
              <p className="text-gray-300 text-lg">Ready to continue your learning journey?</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white border-2 border-gray-200 rounded-2xl text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 transition-all text-lg font-medium shadow-lg hover:shadow-xl"
            />
          </div>
        </div>

        {/* Available Quizzes Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-black">
              Available Quizzes
            </h3>
            <span className="text-gray-600 text-sm">
              {filteredQuizzes.length} {filteredQuizzes.length === 1 ? 'quiz' : 'quizzes'} available
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-3" />
              <p className="text-gray-600">Loading quizzes...</p>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="text-center py-20 px-6 bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-gray-200 shadow-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="h-10 w-10 text-gray-600" />
              </div>
              <h3 className="text-2xl font-black text-black mb-3">
                {searchQuery ? 'No quizzes found' : 'No quizzes yet'}
              </h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Create your first quiz to get started'}
              </p>
              {!searchQuery && (
                <div className="flex gap-4 justify-center">
                  <Link 
                    to="/generate" 
                    className="px-6 py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl font-bold hover:from-gray-900 hover:to-black flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Sparkles className="h-5 w-5" />
                    AI Generate
                  </Link>
                  <Link 
                    to="/create-manual-quiz" 
                    className="px-6 py-3 bg-white text-black border-2 border-gray-800 rounded-xl font-bold hover:bg-gray-50 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Edit3 className="h-5 w-5" />
                    Create Manual
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes.slice(0, 6).map((quiz) => {
                const isMyQuiz = quiz.created_by === user?.email
                
                return (
                  <div
                    key={quiz.id}
                    className="bg-white rounded-2xl border-2 border-gray-200 hover:border-black transition-all duration-300 overflow-hidden group hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    {/* Quiz Icon/Header */}
                    <div className="bg-gradient-to-br from-black via-gray-900 to-black p-6 relative">
                      <div className="bg-gradient-to-br from-white to-gray-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                        <BookOpen className="h-8 w-8 text-black" />
                      </div>
                      {/* Creator Badge */}
                      {isMyQuiz ? (
                        <span className="absolute top-4 right-4 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg">
                          My Quiz
                        </span>
                      ) : (
                        <span className="absolute top-4 right-4 px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/30">
                          Public
                        </span>
                      )}
                    </div>

                    {/* Quiz Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-black text-black mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
                        {quiz.title}
                      </h3>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-semibold text-gray-600">
                          {getQuizCategory(quiz)}
                        </p>
                        {!isMyQuiz && quiz.created_by && (
                          <p className="text-xs text-gray-500 italic font-medium">
                            by {quiz.created_by.split('@')[0]}
                          </p>
                        )}
                      </div>

                    {/* Quiz Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        <span>{quiz.questions?.length || 0} Questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        <span>{getQuizTimeLimit(quiz)}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      to={`/quiz/${quiz.id}/start`}
                      className="w-full py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl font-bold hover:from-gray-900 hover:to-black flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
                    >
                      <PlayCircle className="h-5 w-5" />
                      Start Quiz
                    </Link>
                  </div>
                </div>
                )
              })}
              </div>

              {/* See More Button */}
              {filteredQuizzes.length > 6 && (
                <div className="mt-8 text-center">
                  <Link
                    to="/all-quizzes"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                  >
                    <BookOpen className="h-5 w-5" />
                    See More Quizzes ({filteredQuizzes.length - 6} more)
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Recent Results Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-black">
              Recent Results
            </h3>
            <button
              onClick={() => {
                console.log('🔄 Manually refreshing attempts...');
                fetchRecentAttempts();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {recentAttempts.length === 0 ? (
            <div className="text-center py-12 px-6 bg-gray-50 rounded-xl border border-gray-300">
              <Trophy className="h-10 w-10 text-gray-400 mb-3 mx-auto" />
              <p className="text-gray-600">No quiz attempts yet</p>
              <p className="text-sm text-gray-500 mt-1">Your recent quiz results will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAttempts.slice(0, 5).map((attempt, index) => {
                const percentage = ((attempt.score / (attempt.max_score || attempt.total_questions)) * 100).toFixed(1);
                return (
                  <div
                    key={attempt.id || index}
                    className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      {/* Gradient Icon */}
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <BookOpen className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-lg mb-1">
                          {attempt.quiz_title || 'Quiz'}
                        </h4>
                        <p className="text-sm text-gray-400">
                          Completed {formatDate(attempt.completed_at || attempt.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-4xl font-bold text-white">{percentage}%</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedAttempt(attempt);
                          setShowDetailsModal(true);
                        }}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedAttempt && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold">{selectedAttempt.quiz_title}</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-300">
                  Completed {formatDate(selectedAttempt.completed_at || selectedAttempt.created_at)}
                </p>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Score Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Your Score</p>
                      <p className="text-4xl font-bold text-slate-900">
                        {selectedAttempt.score} / {selectedAttempt.max_score || selectedAttempt.total_questions}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600 text-sm mb-1">Percentage</p>
                      <p className="text-4xl font-bold text-blue-600">
                        {((selectedAttempt.score / (selectedAttempt.max_score || selectedAttempt.total_questions)) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Questions Breakdown */}
                {selectedAttempt.question_details && selectedAttempt.question_details.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Question Details</h3>
                    {selectedAttempt.question_details.map((detail, idx) => {
                      const isCorrect = detail.is_correct;
                      const isAnswered = detail.is_answered;
                      const userAnswerIndices = detail.user_answers || [];
                      const userAnswerTexts = userAnswerIndices.map(i => detail.options[i] || 'Unknown').join(', ');
                      const correctIndices = detail.correct_indices || [];
                      const correctAnswerTexts = correctIndices.map(i => detail.options[i] || 'Unknown').join(', ');
                      return (
                        <div
                          key={idx}
                          className={`p-5 rounded-xl border-2 ${
                            !isAnswered ? 'bg-gray-50 border-gray-300' :
                            isCorrect 
                              ? 'bg-green-50 border-green-300' 
                              : 'bg-red-50 border-red-300'
                          }`}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              !isAnswered ? 'bg-gray-400' :
                              isCorrect ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                              {!isAnswered ? (
                                <AlertCircle className="w-5 h-5 text-white" />
                              ) : isCorrect ? (
                                <CheckCircle2 className="w-5 h-5 text-white" />
                              ) : (
                                <X className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900 mb-2">
                                Question {idx + 1}: {detail.question}
                              </p>
                              <div className="space-y-2 text-sm">
                                {isAnswered ? (
                                  <>
                                    <p className="text-gray-700">
                                      <span className="font-medium">Your Answer:</span>{' '}
                                      <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                                        {userAnswerTexts || 'None'}
                                      </span>
                                    </p>
                                    {!isCorrect && (
                                      <p className="text-gray-700">
                                        <span className="font-medium">Correct Answer:</span>{' '}
                                        <span className="text-green-700">
                                          {correctAnswerTexts}
                                        </span>
                                      </p>
                                    )}
                                  </>
                                ) : (
                                  <p className="text-gray-600">
                                    <span className="font-medium">Not answered</span>
                                    <br />
                                    <span className="text-sm">Correct Answer: </span>
                                    <span className="text-green-700">{correctAnswerTexts}</span>
                                  </p>
                                )}
                                {detail.explanation && (
                                  <p className="text-gray-600 mt-2 pt-2 border-t border-gray-200">
                                    <span className="font-medium">💡 Explanation:</span> {detail.explanation}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No detailed answers available for this attempt.</p>
                    <Link
                      to={`/attempt/${selectedAttempt.id}/review`}
                      className="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      View Full Attempt Details
                    </Link>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
                >
                  Close
                </button>
                <Link
                  to={`/attempt/${selectedAttempt.id}`}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
