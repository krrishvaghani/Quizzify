import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart3, TrendingUp, Users, Clock, AlertTriangle, Download, 
  ArrowLeft, FileText, Calendar, CheckCircle, XCircle, MinusCircle,
  Award, Target, Activity, BookOpen, Home, Eye
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const overallStats = calculateOverallStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Overall Analytics</h1>
                <p className="text-gray-600 mt-1">Comprehensive view of all your quizzes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home className="w-5 w-5" />
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Overall Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Quizzes</h3>
            <p className="text-3xl font-bold text-gray-800">{overallStats.totalQuizzes}</p>
            <p className="text-sm text-gray-500 mt-1">
              {overallStats.quizzesWithAttempts} with attempts
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Attempts</h3>
            <p className="text-3xl font-bold text-gray-800">{overallStats.totalAttempts}</p>
            <p className="text-sm text-gray-500 mt-1">
              Across all quizzes
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Average Score</h3>
            <p className="text-3xl font-bold text-gray-800">
              {overallStats.avgScore}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Overall performance
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Issues Found</h3>
            <p className="text-3xl font-bold text-gray-800">
              {overallStats.totalProblematicQuestions}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Problematic questions
            </p>
          </div>
        </div>

        {/* No Data Message */}
        {allQuizzes.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Quizzes Yet</h3>
            <p className="text-gray-600 mb-6">Create your first quiz to see analytics</p>
            <Link
              to="/generate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Generate Quiz
            </Link>
          </div>
        )}

        {/* Quiz List with Analytics */}
        {allQuizzes.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-100">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Quiz Performance Overview
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quiz Title</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Questions</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Attempts</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Avg Score</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Issues</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Created</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allQuizzes.map((quiz) => {
                    const hasData = quiz.hasAttempts;
                    const analytics = quiz.analytics;

                    return (
                      <tr key={quiz.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-800">{quiz.title}</p>
                              {!hasData && (
                                <p className="text-xs text-gray-500">No attempts yet</p>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 text-center">
                          <span className="text-gray-700 font-medium">
                            {quiz.questions?.length || 0}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          {hasData ? (
                            <div className="flex items-center justify-center gap-1">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-800">
                                {analytics.total_attempts}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-center">
                          {hasData ? (
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(analytics.summary.percentage.mean)}`}>
                              {analytics.summary.percentage.mean}%
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-center">
                          {hasData ? (
                            analytics.summary.problematic_questions_count > 0 ? (
                              <div className="flex items-center justify-center gap-1">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <span className="text-red-600 font-semibold">
                                  {analytics.summary.problematic_questions_count}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-green-600 font-semibold">0</span>
                              </div>
                            )
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                          {formatDate(quiz.created_at)}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              to={`/quiz/${quiz.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Quiz"
                            >
                              <Eye className="w-5 h-5" />
                            </Link>
                            {hasData && (
                              <Link
                                to={`/quiz/${quiz.id}/analytics`}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Detailed Analytics"
                              >
                                <BarChart3 className="w-5 h-5" />
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
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
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
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">Best Performing</h4>
                    </div>
                    <p className="text-gray-700 font-medium mb-1">{bestQuiz.title}</p>
                    <p className="text-2xl font-bold text-green-600">
                      {bestQuiz.analytics.summary.percentage.mean}%
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
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">Most Popular</h4>
                    </div>
                    <p className="text-gray-700 font-medium mb-1">{mostAttempts.title}</p>
                    <p className="text-2xl font-bold text-blue-600">
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
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h4 className="font-semibold text-red-800">Needs Attention</h4>
                    </div>
                    <p className="text-gray-700 font-medium mb-1">{needsAttention.title}</p>
                    <p className="text-2xl font-bold text-red-600">
                      {needsAttention.analytics.summary.problematic_questions_count} issues
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">All Good!</h4>
                    </div>
                    <p className="text-gray-700 font-medium mb-1">No issues found</p>
                    <p className="text-sm text-green-600">
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
