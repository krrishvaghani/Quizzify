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
      <aside className="w-64 bg-[#1a1f2e] border-r border-[#2d3548] flex flex-col fixed h-screen overflow-hidden shadow-2xl">
        {/* Logo */}
        <div className="p-6 border-b border-[#2d3548] flex-shrink-0">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-black text-white tracking-wide">QUIZZIFY</h1>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-hidden">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-xl font-bold shadow-lg transition-all hover:shadow-xl"
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/generate"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[#2d3548] hover:text-white rounded-xl font-semibold transition-all hover:translate-x-1"
          >
            <Sparkles className="h-5 w-5" />
            <span>Create Quiz</span>
          </Link>

          <Link
            to="/create-room"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[#2d3548] hover:text-white rounded-xl font-semibold transition-all hover:translate-x-1"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create Room</span>
          </Link>

          <Link
            to="/rooms"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[#2d3548] hover:text-white rounded-xl font-semibold transition-all hover:translate-x-1"
          >
            <Users className="h-5 w-5" />
            <span>Rooms</span>
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[#2d3548] hover:text-white rounded-xl font-semibold transition-all hover:translate-x-1"
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </Link>
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-[#2d3548] flex-shrink-0">
          <div className="flex items-center gap-3 mb-3 px-2 bg-[#2d3548] rounded-xl p-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
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
      <main className="flex-1 overflow-y-auto bg-[#0f1419] ml-64">
        {/* Welcome Section with Search Bar - Compact */}
        <div className="bg-[#1a1f2e] text-white p-4 shadow-xl border-b border-[#2d3548]">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold mb-0">
                  Welcome back!
                </h2>
                <p className="text-gray-400 text-xs">Ready to continue your learning journey?</p>
              </div>
            </div>
            {/* Search Bar - Top Right */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm bg-[#252b3b] border-2 border-[#2d3548] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all font-medium shadow-lg"
              />
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-8 py-6">

        {/* Available Quizzes Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">
              Available Quizzes
            </h3>
            <span className="text-gray-400 text-xs font-semibold">
              {filteredQuizzes.length} {filteredQuizzes.length === 1 ? 'quiz' : 'quizzes'} available
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 text-cyan-500 animate-spin mb-3" />
              <p className="text-gray-400">Loading quizzes...</p>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="text-center py-12 px-6 bg-[#1a1f2e] rounded-2xl border-2 border-[#2d3548] shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {searchQuery ? 'No quizzes found' : 'No quizzes yet'}
              </h3>
              <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Create your first quiz to get started'}
              </p>
              {!searchQuery && (
                <div className="flex gap-3 justify-center">
                  <Link 
                    to="/generate" 
                    className="px-4 py-2 text-sm bg-gradient-to-r from-black to-gray-800 text-white rounded-lg font-bold hover:from-gray-900 hover:to-black flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Sparkles className="h-4 w-4" />
                    AI Generate
                  </Link>
                  <Link 
                    to="/create-manual-quiz" 
                    className="px-4 py-2 text-sm bg-white text-black border-2 border-gray-800 rounded-lg font-bold hover:bg-gray-50 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Edit3 className="h-4 w-4" />
                    Create Manual
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(searchQuery ? filteredQuizzes : filteredQuizzes.slice(0, 6)).map((quiz) => {
                const isMyQuiz = quiz.created_by === user?.email
                
                return (
                  <div
                    key={quiz.id}
                    className="bg-[#1a1f2e] rounded-xl border-2 border-[#2d3548] hover:border-cyan-500 transition-all duration-300 overflow-hidden hover:shadow-xl"
                  >
                    {/* Quiz Header with Icon and Badge */}
                    <div className="p-3 flex items-start justify-between">
                      <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      {/* Creator Badge */}
                      {isMyQuiz && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold rounded">
                          My Quiz
                        </span>
                      )}
                    </div>

                    {/* Quiz Content */}
                    <div className="px-3 pb-3">
                      <h3 className="text-base font-bold text-white mb-1 line-clamp-1">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-gray-400 mb-3">
                        {getQuizCategory(quiz)}
                      </p>

                    {/* Quiz Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        <span>{quiz.questions?.length || 0} Questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{getQuizTimeLimit(quiz)}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      to={`/quiz/${quiz.id}/start`}
                      className="w-full py-2.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-lg font-bold text-sm hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 flex items-center justify-center gap-2 transition-all"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Start Quiz
                    </Link>
                  </div>
                </div>
                )
              })}
              </div>

              {/* See All Quizzes Button */}
              {!searchQuery && filteredQuizzes.length > 6 && (
                <div className="mt-6 text-center">
                  <Link
                    to="/all-quizzes"
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-lg font-bold hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 transition-all shadow-lg"
                  >
                    <BookOpen className="h-4 w-4" />
                    See All Quizzes ({filteredQuizzes.length} total)
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Recent Results Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">
              Recent Results
            </h3>
            <button
              onClick={() => {
                console.log('🔄 Manually refreshing attempts...');
                fetchRecentAttempts();
              }}
              className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-[#1a1f2e] border border-[#2d3548] rounded-lg hover:bg-[#252b3b] transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              Refresh
            </button>
          </div>

          {recentAttempts.length === 0 ? (
            <div className="text-center py-8 px-6 bg-[#1a1f2e] rounded-xl border-2 border-[#2d3548]">
              <Trophy className="h-8 w-8 text-gray-500 mb-2 mx-auto" />
              <p className="text-gray-300 text-sm font-semibold">No quiz attempts yet</p>
              <p className="text-xs text-gray-500 mt-1">Your recent quiz results will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAttempts.slice(0, 3).map((attempt, index) => {
                const percentage = ((attempt.score / (attempt.max_score || attempt.total_questions)) * 100).toFixed(1);
                return (
                  <div
                    key={attempt.id || index}
                    className="flex items-center justify-between p-4 bg-[#1a1f2e] rounded-xl border-2 border-[#2d3548] hover:border-cyan-500 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {/* Gradient Icon */}
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm mb-0.5">
                          {attempt.quiz_title || 'Quiz'}
                        </h4>
                        <p className="text-xs text-gray-400">
                          Completed on {formatDate(attempt.completed_at || attempt.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 mb-0.5">Score</p>
                        <p className="text-2xl font-bold text-cyan-400">{percentage}%</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedAttempt(attempt);
                          setShowDetailsModal(true);
                        }}
                        className="px-4 py-2 text-sm bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-lg transition-colors"
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
