import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart3, TrendingUp, Users, Clock, AlertTriangle, Download, 
  ArrowLeft, FileText, Calendar, CheckCircle, XCircle, MinusCircle,
  Award, Target, Activity, BookOpen, Home, Eye, LogOut, User, Plus, PlusCircle
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import AnimatedTabs from '../components/AnimatedTabs';

const Analytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllQuizzesAnalytics();
  }, []);

  const fetchAllQuizzesAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/quizzes');
      const quizzes = response.data.quizzes || [];
      
      // Fetch analytics for each quiz
      const quizzesWithAnalytics = await Promise.all(
        quizzes.map(async (quiz) => {
          try {
            const analyticsResponse = await api.get(`/quizzes/${quiz.id}/analytics`);
            return {
              ...quiz,
              analytics: analyticsResponse.data,
              hasAttempts: analyticsResponse.data.total_attempts > 0
            };
          } catch (err) {
            return {
              ...quiz,
              analytics: null,
              hasAttempts: false
            };
          }
        })
      );
      
      setAllQuizzes(quizzesWithAnalytics);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallStats = () => {
    const quizzesWithAttempts = allQuizzes.filter(q => q.hasAttempts);
    
    if (quizzesWithAttempts.length === 0) {
      return {
        totalQuizzes: allQuizzes.length,
        totalAttempts: 0,
        avgScore: 0,
        totalProblematicQuestions: 0,
        quizzesWithAttempts: 0
      };
    }

    const totalAttempts = quizzesWithAttempts.reduce((sum, q) => sum + q.analytics.total_attempts, 0);
    const avgScore = quizzesWithAttempts.reduce((sum, q) => sum + q.analytics.summary.percentage.mean, 0) / quizzesWithAttempts.length;
    const totalProblematicQuestions = quizzesWithAttempts.reduce((sum, q) => sum + q.analytics.summary.problematic_questions_count, 0);

    return {
      totalQuizzes: allQuizzes.length,
      totalAttempts,
      avgScore: avgScore.toFixed(1),
      totalProblematicQuestions,
      quizzesWithAttempts: quizzesWithAttempts.length
    };
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 70) return 'text-green-600 bg-green-50';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-black mx-auto mb-4" />
          <p className="text-gray-700 font-bold text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl border-2 border-gray-200 max-w-md text-center shadow-xl">
          <div className="bg-red-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-black text-black mb-3">Something went wrong</h2>
          <p className="text-gray-600 mb-6 font-medium">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const overallStats = calculateOverallStats();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-white hover:text-gray-300"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Analytics</h1>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <AnimatedTabs
                tabs={[
                  { label: 'Dashboard', value: 'dashboard' },
                  { label: 'Analytics', value: 'analytics' },
                  { label: 'Create Quiz', value: 'generate' },
                  { label: 'Room', value: 'create-room' },
                  { label: 'Rooms', value: 'rooms' }
                ]}
                variant="underline"
                activeTab="analytics"
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
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <BookOpen className="w-7 h-7 text-black" />
            </div>
            <h3 className="text-gray-500 text-sm mb-2">Total Quizzes</h3>
            <p className="text-4xl font-bold text-black">{overallStats.totalQuizzes}</p>
            <p className="text-sm text-gray-400 mt-2">
              {overallStats.quizzesWithAttempts} with attempts
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-7 h-7 text-black" />
            </div>
            <h3 className="text-gray-500 text-sm mb-2">Total Attempts</h3>
            <p className="text-4xl font-bold text-black">{overallStats.totalAttempts}</p>
            <p className="text-sm text-gray-400 mt-2">
              people took quizzes
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-7 h-7 text-black" />
            </div>
            <h3 className="text-gray-500 text-sm mb-2">Average Score</h3>
            <p className="text-4xl font-bold text-black">
              {overallStats.avgScore}%
            </p>
            <p className="text-sm text-gray-400 mt-2">
              average performance
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <AlertTriangle className="w-7 h-7 text-black" />
            </div>
            <h3 className="text-gray-500 text-sm mb-2">Issues Found</h3>
            <p className="text-4xl font-bold text-black">
              {overallStats.totalProblematicQuestions}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              tricky questions
            </p>
          </div>
        </div>

        {/* No Data Message */}
        {allQuizzes.length === 0 && (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-16 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-black mb-3">No quizzes yet</h3>
            <p className="text-lg text-gray-500 mb-8">Create one to see analytics</p>
            <Link
              to="/generate"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 text-lg font-medium border-2 border-black"
            >
              <FileText className="w-5 h-5" />
              Create one
            </Link>
          </div>
        )}

        {/* Quiz List with Analytics */}
        {allQuizzes.length > 0 && (
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <div className="px-8 py-5 border-b-2 border-gray-200">
              <h2 className="text-2xl font-bold text-black">Quiz Performance</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase">Quiz</th>
                    <th className="px-8 py-4 text-center text-sm font-medium text-gray-500 uppercase">Questions</th>
                    <th className="px-8 py-4 text-center text-sm font-medium text-gray-500 uppercase">Attempts</th>
                    <th className="px-8 py-4 text-center text-sm font-medium text-gray-500 uppercase">Avg Score</th>
                    <th className="px-8 py-4 text-center text-sm font-medium text-gray-500 uppercase">Issues</th>
                    <th className="px-8 py-4 text-center text-sm font-medium text-gray-500 uppercase">Created</th>
                    <th className="px-8 py-4 text-center text-sm font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-200">
                  {allQuizzes.map((quiz) => {
                    const hasData = quiz.hasAttempts;
                    const analytics = quiz.analytics;

                    return (
                      <tr key={quiz.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-6 h-6 text-black" />
                            <div>
                              <p className="font-medium text-gray-800 text-base">{quiz.title}</p>
                              {!hasData && (
                                <p className="text-sm text-gray-500">No attempts yet</p>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-8 py-5 text-center">
                          <span className="text-gray-700 font-medium text-base">
                            {quiz.questions?.length || 0}
                          </span>
                        </td>

                        <td className="px-8 py-5 text-center">
                          {hasData ? (
                            <div className="flex items-center justify-center gap-2">
                              <Users className="w-5 h-5 text-gray-500" />
                              <span className="font-medium text-gray-800 text-base">
                                {analytics.total_attempts}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-base">-</span>
                          )}
                        </td>

                        <td className="px-8 py-5 text-center">
                          {hasData ? (
                            <span className={`px-4 py-2 rounded-full text-base font-semibold ${getScoreColor(analytics.summary.percentage.mean)}`}>
                              {Math.round(analytics.summary.percentage.mean)}%
                            </span>
                          ) : (
                            <span className="text-gray-400 text-base">-</span>
                          )}
                        </td>

                        <td className="px-8 py-5 text-center">
                          {hasData ? (
                            analytics.summary.problematic_questions_count > 0 ? (
                              <div className="flex items-center justify-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                <span className="text-red-600 font-semibold text-base">
                                  {analytics.summary.problematic_questions_count}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="text-green-600 font-semibold text-base">0</span>
                              </div>
                            )
                          ) : (
                            <span className="text-gray-400 text-base">-</span>
                          )}
                        </td>

                        <td className="px-8 py-5 text-center text-base text-gray-600">
                          {formatDate(quiz.created_at)}
                        </td>

                        <td className="px-8 py-5 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <Link
                              to={`/quiz/${quiz.id}`}
                              className="p-3 text-black hover:bg-gray-100 rounded-xl transition-colors border-2 border-gray-200"
                              title="View Quiz"
                            >
                              <Eye className="w-6 h-6" />
                            </Link>
                            {hasData && (
                              <Link
                                to={`/quiz/${quiz.id}/analytics`}
                                className="p-3 text-black hover:bg-gray-100 rounded-xl transition-colors border-2 border-gray-200"
                                title="Detailed Analytics"
                              >
                                <BarChart3 className="w-6 h-6" />
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Performance Summary */}
        {allQuizzes.filter(q => q.hasAttempts).length > 0 && (
          <div className="mt-8 bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-black text-black mb-6 flex items-center gap-3">
              <TrendingUp className="w-7 h-7" />
              Performance Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Best Performing Quiz */}
              {(() => {
                const bestQuiz = allQuizzes
                  .filter(q => q.hasAttempts)
                  .reduce((best, current) => 
                    !best || current.analytics.summary.percentage.mean > best.analytics.summary.percentage.mean 
                      ? current 
                      : best
                  , null);

                return bestQuiz && (
                  <div className="p-6 bg-green-50 border-2 border-green-300 rounded-2xl shadow-md hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Award className="w-6 h-6 text-green-600" />
                      <h4 className="font-black text-green-800 text-lg">Best Performing</h4>
                    </div>
                    <p className="text-gray-800 font-bold mb-2">{bestQuiz.title}</p>
                    <p className="text-3xl font-black text-green-600">
                      {Math.round(bestQuiz.analytics.summary.percentage.mean)}%
                    </p>
                  </div>
                );
              })()}

              {/* Most Attempts */}
              {(() => {
                const mostAttempts = allQuizzes
                  .filter(q => q.hasAttempts)
                  .reduce((max, current) => 
                    !max || current.analytics.total_attempts > max.analytics.total_attempts 
                      ? current 
                      : max
                  , null);

                return mostAttempts && (
                  <div className="p-6 bg-blue-50 border-2 border-blue-300 rounded-2xl shadow-md hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="w-6 h-6 text-blue-600" />
                      <h4 className="font-black text-blue-800 text-lg">Most Popular</h4>
                    </div>
                    <p className="text-gray-800 font-bold mb-2">{mostAttempts.title}</p>
                    <p className="text-3xl font-black text-blue-600">
                      {mostAttempts.analytics.total_attempts} attempts
                    </p>
                  </div>
                );
              })()}

              {/* Needs Attention */}
              {(() => {
                const needsAttention = allQuizzes
                  .filter(q => q.hasAttempts && q.analytics.summary.problematic_questions_count > 0)
                  .reduce((max, current) => 
                    !max || current.analytics.summary.problematic_questions_count > max.analytics.summary.problematic_questions_count 
                      ? current 
                      : max
                  , null);

                return needsAttention ? (
                  <div className="p-6 bg-red-50 border-2 border-red-300 rounded-2xl shadow-md hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                      <h4 className="font-black text-red-800 text-lg">Needs Attention</h4>
                    </div>
                    <p className="text-gray-800 font-bold mb-2">{needsAttention.title}</p>
                    <p className="text-3xl font-black text-red-600">
                      {needsAttention.analytics.summary.problematic_questions_count} issues
                    </p>
                  </div>
                ) : (
                  <div className="p-6 bg-green-50 border-2 border-green-300 rounded-2xl shadow-md hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h4 className="font-black text-green-800 text-lg">All Good!</h4>
                    </div>
                    <p className="text-gray-800 font-bold mb-2">No issues found</p>
                    <p className="text-sm text-green-700 font-semibold">
                      All quizzes are performing well
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
