import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BarChart3, TrendingUp, Users, Clock, AlertTriangle, Download, 
  ArrowLeft, FileText, Calendar, CheckCircle, XCircle, MinusCircle,
  Award, Target, Activity
} from 'lucide-react';
import api from '../utils/api';

const QuizAnalytics = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [topicAnalytics, setTopicAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  useEffect(() => {
    fetchAnalytics();
    fetchTopicAnalytics();
  }, [quizId]);

  const fetchAnalytics = async (startDate = '', endDate = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const response = await api.get(`/quizzes/${quizId}/analytics?${params.toString()}`);
      setAnalytics(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopicAnalytics = async () => {
    try {
      const response = await api.get(`/quizzes/${quizId}/analytics/topics`);
      setTopicAnalytics(response.data);
    } catch (err) {
      console.error('Failed to load topic analytics:', err);
      // Don't set error, just log it - topic analytics is optional
    }
  };

  const handleDateRangeChange = (type, value) => {
    const newDateRange = { ...dateRange, [type]: value };
    setDateRange(newDateRange);
    
    if (newDateRange.start || newDateRange.end) {
      const start = newDateRange.start ? new Date(newDateRange.start).toISOString() : '';
      const end = newDateRange.end ? new Date(newDateRange.end).toISOString() : '';
      fetchAnalytics(start, end);
    } else {
      fetchAnalytics();
    }
  };

  const exportCSV = async () => {
    try {
      setExportingCSV(true);
      const response = await api.get(`/quizzes/${quizId}/analytics/export/csv`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quiz_${quizId}_analytics.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export CSV');
    } finally {
      setExportingCSV(false);
    }
  };

  const exportPDF = async () => {
    try {
      setExportingPDF(true);
      const response = await api.get(`/quizzes/${quizId}/analytics/export/pdf`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quiz_${quizId}_analytics_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export PDF');
    } finally {
      setExportingPDF(false);
    }
  };

  const getSeverityColor = (percentage) => {
    if (percentage >= 70) return 'text-green-600 bg-green-50';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getDiscriminationColor = (index) => {
    if (index >= 0.3) return 'text-green-600 bg-green-50';
    if (index >= 0.2) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
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

  if (!analytics) return null;

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
                <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-1">{analytics.quiz_title}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportCSV}
                disabled={exportingCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {exportingCSV ? 'Exporting...' : 'Export CSV'}
              </button>
              <button
                onClick={exportPDF}
                disabled={exportingPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                {exportingPDF ? 'Exporting...' : 'Export PDF'}
              </button>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">From:</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">To:</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {(dateRange.start || dateRange.end) && (
                <button
                  onClick={() => {
                    setDateRange({ start: '', end: '' });
                    fetchAnalytics();
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Attempts</h3>
            <p className="text-3xl font-bold text-gray-800">{analytics.total_attempts}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Average Score</h3>
            <p className="text-3xl font-bold text-gray-800">
              {analytics.summary.percentage.mean}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Median: {analytics.summary.percentage.median}%
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Avg. Time</h3>
            <p className="text-2xl font-bold text-gray-800">
              {analytics.summary.time_taken.average_formatted}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Problematic Questions</h3>
            <p className="text-3xl font-bold text-gray-800">
              {analytics.summary.problematic_questions_count}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Out of {analytics.total_questions}
            </p>
          </div>
        </div>

        {/* Score Distribution Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Score Distribution
          </h2>
          <div className="flex items-end justify-around h-64 border-l border-b border-gray-300">
            {analytics.score_distribution.map((item, idx) => {
              const maxCount = Math.max(...analytics.score_distribution.map(d => d.count));
              const height = (item.count / maxCount) * 100;
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="text-xs font-semibold text-gray-700">{item.count}</div>
                  <div
                    className="w-12 bg-gray-700 rounded-t-lg hover:bg-gray-800 transition-all"
                    style={{ height: `${height}%` }}
                  />
                  <div className="text-xs text-gray-600">{item.score}</div>
                </div>
              );
            })}
          </div>
          <div className="text-center text-sm text-gray-600 mt-4">Score (out of {analytics.total_questions})</div>
        </div>

        {/* Topic-wise Performance */}
        {topicAnalytics && topicAnalytics.topic_performance && topicAnalytics.topic_performance.length > 0 && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6" />
                Topic-wise Performance
              </h2>
              
              {/* Topic Performance Bar Chart */}
              <div className="mb-6">
                <div className="flex items-end justify-start gap-3 h-64 border-l border-b border-gray-300 overflow-x-auto pb-2">
                  {topicAnalytics.topic_performance.map((topic, idx) => {
                    const height = topic.average_score;
                    const color = topic.average_score >= 80 ? 'bg-green-600' : 
                                  topic.average_score >= 60 ? 'bg-yellow-500' : 'bg-red-500';
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 min-w-[80px]">
                        <div className="text-xs font-semibold text-gray-700">
                          {topic.average_score}%
                        </div>
                        <div
                          className={`w-16 ${color} rounded-t-lg transition-all hover:opacity-80`}
                          style={{ height: `${height}%` }}
                          title={`${topic.topic}: ${topic.average_score}% avg score`}
                        />
                        <div className="text-xs text-gray-600 text-center max-w-[80px] break-words">
                          {topic.topic}
                        </div>
                        <div className="text-xs text-gray-400">
                          {topic.total_questions} Q
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-center text-sm text-gray-600 mt-2">Topics / Average Score</div>
              </div>

              {/* Weak Topics Alert */}
              {topicAnalytics.weak_topics && topicAnalytics.weak_topics.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div className="ml-3">
                      <h3 className="text-red-800 font-semibold text-sm">
                        Weak Topics Identified
                      </h3>
                      <div className="mt-2 space-y-2">
                        {topicAnalytics.weak_topics.map((topic, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white p-2 rounded">
                            <span className="text-sm font-medium text-gray-800">{topic.topic}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-600">
                                {topic.correct_count}/{topic.total_attempts} correct
                              </span>
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                                {topic.average_score}% avg
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-red-700 text-xs mt-2">
                        💡 Focus on these topics in upcoming lessons or create targeted practice quizzes.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Strong Topics */}
              {topicAnalytics.strong_topics && topicAnalytics.strong_topics.length > 0 && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Award className="w-5 h-5 text-green-500 mt-0.5" />
                    <div className="ml-3">
                      <h3 className="text-green-800 font-semibold text-sm">
                        Strong Topics
                      </h3>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {topicAnalytics.strong_topics.map((topic, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white p-2 rounded">
                            <span className="text-sm font-medium text-gray-800">{topic.topic}</span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                              {topic.average_score}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Topic Table */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Detailed Topic Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Topic
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Questions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Accuracy
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Correct
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Incorrect
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Skipped
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topicAnalytics.topic_performance.map((topic, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{topic.topic}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {topic.total_questions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${getSeverityColor(topic.average_score)}`}>
                            {topic.average_score}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${getSeverityColor(topic.accuracy_percentage)}`}>
                            {topic.accuracy_percentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="text-green-600 font-medium">{topic.correct_count}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="text-red-600 font-medium">{topic.incorrect_count}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="text-gray-600 font-medium">{topic.skipped_count}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Time Analytics */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Time Analysis Per Question
          </h2>
          
          {/* Time per Question Bar Chart */}
          <div className="mb-6">
            <div className="flex items-end justify-start gap-2 h-64 border-l border-b border-gray-300 overflow-x-auto pb-2">
              {analytics.question_metrics
                .filter(q => q.time_samples > 0)
                .map((question, idx) => {
                  const maxTime = Math.max(...analytics.question_metrics.map(q => q.avg_time_seconds));
                  const height = (question.avg_time_seconds / maxTime) * 100;
                  const color = question.avg_time_seconds > 120 ? 'bg-red-500' :
                                question.avg_time_seconds > 60 ? 'bg-yellow-500' : 'bg-green-500';
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 min-w-[60px]">
                      <div className="text-xs font-semibold text-gray-700">
                        {Math.round(question.avg_time_seconds)}s
                      </div>
                      <div
                        className={`w-12 ${color} rounded-t-lg transition-all hover:opacity-80 cursor-pointer`}
                        style={{ height: `${height}%` }}
                        title={`Q${question.question_index + 1}: ${Math.round(question.avg_time_seconds)}s avg (${question.time_samples} samples)`}
                      />
                      <div className="text-xs text-gray-600 text-center">
                        Q{question.question_index + 1}
                      </div>
                      <div className="text-xs text-gray-400">
                        {question.correct_percentage}%
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="text-center text-sm text-gray-600 mt-2">
              Question / Avg Time (seconds) / Correct %
            </div>
          </div>

          {/* Top 5 Slowest Questions */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div className="ml-3 w-full">
                <h3 className="text-yellow-800 font-semibold text-sm mb-3">
                  Top 5 Slowest Questions (May Be Confusing)
                </h3>
                <div className="space-y-2">
                  {[...analytics.question_metrics]
                    .filter(q => q.time_samples > 0)
                    .sort((a, b) => b.avg_time_seconds - a.avg_time_seconds)
                    .slice(0, 5)
                    .map((question, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-1 bg-gray-900 text-white text-xs font-bold rounded">
                                Q{question.question_index + 1}
                              </span>
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded">
                                {Math.round(question.avg_time_seconds)}s avg
                              </span>
                              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                question.correct_percentage >= 60 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {question.correct_percentage}% correct
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {question.question_text}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">
                              {question.time_samples} attempts
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <p className="text-yellow-700 text-xs mt-3">
                  💡 Questions taking longer may indicate confusion or complexity. Consider revising wording or providing hints.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Attempts Over Time */}
        {analytics.attempts_over_time.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Score Trend Over Time
            </h2>
            <div className="overflow-x-auto">
              <div className="flex items-end justify-around min-w-full h-48 border-l border-b border-gray-300">
                {analytics.attempts_over_time.map((item, idx) => {
                  const maxScore = 100;
                  const height = (item.average_score / maxScore) * 100;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 min-w-[60px]">
                      <div className="text-xs font-semibold text-gray-700">
                        {item.average_score}%
                      </div>
                      <div
                        className="w-8 bg-gray-600 rounded-t-lg"
                        style={{ height: `${height}%` }}
                      />
                      <div className="text-xs text-gray-600 text-center">
                        {item.date}
                        <div className="text-xs text-gray-400">({item.attempts_count})</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Problematic Questions Alert */}
        {analytics.problematic_questions.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-red-500 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-red-800 font-semibold">
                  {analytics.problematic_questions.length} Question(s) Need Attention
                </h3>
                <p className="text-red-700 text-sm mt-1">
                  Review the questions below with low correct rates, high skip rates, or poor discrimination.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Per-Question Metrics Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-6 h-6" />
            Per-Question Analysis
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Q#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Question</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    <div className="flex items-center justify-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Correct %
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    <div className="flex items-center justify-center gap-1">
                      <MinusCircle className="w-4 h-4 text-yellow-600" />
                      Skip %
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Discrimination
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Suggestions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.question_metrics.map((question, idx) => (
                  <tr 
                    key={idx} 
                    className={`${question.is_problematic ? 'bg-red-50' : 'hover:bg-gray-50'} transition-colors`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {question.is_problematic && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="font-medium text-gray-800">
                          Q{question.question_index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-md">
                      {question.question_text}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(question.correct_percentage)}`}>
                        {question.correct_percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${question.skip_rate > 20 ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-50'}`}>
                        {question.skip_rate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDiscriminationColor(question.discrimination_index)}`}>
                        {question.discrimination_index}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {question.suggestions.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {question.suggestions.map((suggestion, sIdx) => (
                            <li key={sIdx} className="text-xs">{suggestion}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Good
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statistics Legend */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Understanding the Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Correct Percentage</h4>
              <p className="text-gray-600">
                <span className="text-green-600">≥70%:</span> Good question<br/>
                <span className="text-yellow-600">40-69%:</span> Moderate difficulty<br/>
                <span className="text-red-600">&lt;40%:</span> Needs review
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Skip Rate</h4>
              <p className="text-gray-600">
                Percentage of students who didn't answer the question. 
                High skip rates (&gt;20%) may indicate unclear or difficult questions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Discrimination Index</h4>
              <p className="text-gray-600">
                <span className="text-green-600">≥0.3:</span> Excellent<br/>
                <span className="text-yellow-600">0.2-0.29:</span> Good<br/>
                <span className="text-red-600">&lt;0.2:</span> Poor discrimination
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAnalytics;
