import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  ArrowLeft, 
  Loader2, 
  Trophy, 
  Users, 
  FileText, 
  TrendingUp,
  Activity,
  Clock
} from 'lucide-react';

const API_URL = 'http://localhost:8000';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/analytics/user/overview`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch analytics');

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg border border-black"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-black">Analytics</h1>
                <p className="text-gray-600 mt-1">View MCQ performance statistics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-black" />
          </div>
        ) : !analytics || analytics.total_quizzes === 0 ? (
          <div className="text-center py-20">
            <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-black mb-2">No Quizzes Yet</h3>
            <p className="text-gray-600 mb-6">Create a quiz to see analytics</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 border border-black"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-6 w-6 text-black" />
                  <span className="text-gray-600 text-sm font-medium">Total Quizzes</span>
                </div>
                <p className="text-3xl font-bold text-black">{analytics.total_quizzes}</p>
              </div>

              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="h-6 w-6 text-black" />
                  <span className="text-gray-600 text-sm font-medium">Total Attempts</span>
                </div>
                <p className="text-3xl font-bold text-black">{analytics.total_attempts}</p>
              </div>

              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-6 w-6 text-black" />
                  <span className="text-gray-600 text-sm font-medium">Total Students</span>
                </div>
                <p className="text-3xl font-bold text-black">{analytics.total_students}</p>
              </div>

              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="h-6 w-6 text-black" />
                  <span className="text-gray-600 text-sm font-medium">Average Score</span>
                </div>
                <p className="text-3xl font-bold text-black">{analytics.average_score}%</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Score Distribution Chart */}
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Score Distribution
                </h3>
                <div className="space-y-3">
                  {Object.entries(analytics.score_distribution).map(([range, count]) => {
                    const maxCount = Math.max(...Object.values(analytics.score_distribution));
                    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    
                    return (
                      <div key={range}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{range}%</span>
                          <span className="text-sm font-bold text-black">{count} attempts</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-6">
                          <div
                            className="bg-black h-6 rounded-full flex items-center justify-end pr-2 transition-all"
                            style={{ width: `${Math.max(percentage, 5)}%` }}
                          >
                            {count > 0 && (
                              <span className="text-xs font-medium text-white">
                                {Math.round((count / analytics.total_attempts) * 100)}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quiz Performance Chart */}
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quiz Performance
                </h3>
                <div className="space-y-3">
                  {analytics.quiz_performance.slice(0, 5).map((quiz) => {
                    // Cap the display percentage at 100% for proper UI rendering
                    const displayScore = Math.min(Math.max(quiz.avg_score, 0), 100);
                    const barWidth = Math.min(displayScore, 100);
                    
                    return (
                      <div key={quiz.quiz_id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 truncate flex-1 max-w-[200px]" title={quiz.quiz_title}>
                            {quiz.quiz_title}
                          </span>
                          <span className="text-sm font-bold text-black ml-2">{displayScore.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                          <div
                            className="bg-black h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-300"
                            style={{ width: `${barWidth}%` }}
                          >
                            {quiz.attempts > 0 && barWidth > 15 && (
                              <span className="text-xs font-medium text-white whitespace-nowrap">
                                {quiz.attempts} {quiz.attempts === 1 ? 'attempt' : 'attempts'}
                              </span>
                            )}
                          </div>
                        </div>
                        {quiz.attempts > 0 && barWidth <= 15 && (
                          <div className="text-xs text-gray-500 mt-1 text-right">
                            {quiz.attempts} {quiz.attempts === 1 ? 'attempt' : 'attempts'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {analytics.quiz_performance.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No quiz attempts yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            {analytics.recent_activity.length > 0 && (
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Quiz</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Student</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Score</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Percentage</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recent_activity.map((activity, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-900">{activity.quiz_title}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{activity.student_name}</td>
                          <td className="py-3 px-4 text-sm text-center font-medium text-black">
                            {activity.score}/{activity.max_score}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              activity.percentage >= 80 ? 'bg-green-100 text-green-800' :
                              activity.percentage >= 60 ? 'bg-blue-100 text-blue-800' :
                              activity.percentage >= 40 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {activity.percentage}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 text-right">
                            {activity.submitted_at ? new Date(activity.submitted_at).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
