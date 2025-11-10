import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Download, AlertTriangle, CheckCircle, XCircle, MinusCircle, BarChart3 } from 'lucide-react';

const API_URL = 'http://localhost:8000';

export default function QuizAnalytics() {
  const { quizId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [quizId]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = API_URL + '/analytics/quiz/' + quizId;
      const response = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + token
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

  const handleExport = async () => {
    try {
      setExporting(true);
      setError(null);
      const token = localStorage.getItem('token');
      const url = API_URL + '/analytics/quiz/' + quizId + '/export';
      const response = await fetch(url, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Export failed');
      }
      
      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'quiz_analytics.csv';
      if (contentDisposition) {
        const matches = /filename=([^;]+)/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1].trim();
        }
      }
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error exporting analytics:', error);
      setError(error.message || 'Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!analytics || analytics.total_attempts === 0 || analytics.insufficient_data) {
    const message = analytics?.message || 'No students have taken this quiz yet.';
    const attempts = analytics?.total_attempts || 0;
    
    return (
      <div className="min-h-screen bg-[#1a1f2e]">
        <div className="border-b border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link to="/analytics" className="inline-flex items-center gap-2 p-2 hover:bg-[#1a1f2e] rounded-lg border border-black">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <AlertTriangle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Insufficient Data to Analyze</h3>
          <p className="text-gray-600 mb-2">{message}</p>
          {attempts > 0 && attempts < 10 && (
            <p className="text-sm text-gray-500">
              Current attempts: {attempts} / 10 required
            </p>
          )}
        </div>
      </div>
    );
  }

  const problematicQuestions = analytics.questions.filter(q => q.is_problematic);

  return (
    <div className="min-h-screen bg-[#1a1f2e]">
      <div className="border-b border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/analytics" className="p-2 hover:bg-[#1a1f2e] rounded-lg border border-black">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">{analytics.quiz_title}</h1>
                <p className="text-gray-600 mt-1">MCQ Analytics</p>
              </div>
            </div>
            <button 
              onClick={handleExport} 
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-[#1a1f2e] border border-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export CSV
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 border-2 border-red-600 bg-red-50 rounded-lg p-4">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="border border-black rounded-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Total Attempts</div>
            <div className="text-3xl font-bold text-white">{analytics.total_attempts}</div>
            <div className="text-xs text-gray-500 mt-1">{analytics.total_students} students</div>
          </div>
          <div className="border border-black rounded-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Average Score</div>
            <div className="text-3xl font-bold text-white">{analytics.average_score}/{analytics.total_questions}</div>
            <div className="text-xs text-gray-500 mt-1">{analytics.average_percentage}%</div>
          </div>
          <div className="border border-black rounded-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Avg Time/Question</div>
            <div className="text-3xl font-bold text-white">{analytics.average_time_per_question || 0}s</div>
            <div className="text-xs text-gray-500 mt-1">per question</div>
          </div>
          <div className="border border-black rounded-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Total Questions</div>
            <div className="text-3xl font-bold text-white">{analytics.total_questions}</div>
          </div>
          <div className="border border-black rounded-lg p-6">
            <div className="text-sm text-gray-600 mb-1">Problematic</div>
            <div className="text-3xl font-bold text-white">{problematicQuestions.length}</div>
            <div className="text-xs text-gray-500 mt-1">need review</div>
          </div>
        </div>

        {analytics.score_distribution && Object.keys(analytics.score_distribution).length > 0 && (
          <div className="border border-black rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-white mb-4">Score Distribution</h3>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(analytics.score_distribution).map(([range, count]) => (
                <div key={range} className="text-center border border-gray-300 rounded p-3">
                  <div className="text-2xl font-bold text-white">{count}</div>
                  <div className="text-sm text-gray-600">{range} correct</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {problematicQuestions.length > 0 && (
          <div className="border-2 border-black rounded-lg p-6 mb-8 bg-[#0f1419]">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-2">{problematicQuestions.length} Question{problematicQuestions.length !== 1 ? 's' : ''} Need Attention</h3>
                <div className="space-y-2">
                  {problematicQuestions.map(q => (
                    <div key={q.question_index} className="text-sm">
                      <span className="font-medium">Q{q.question_number}:</span> {q.flags.join(', ')}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          <h2 className="text-xl font-bold text-white">Question Analysis</h2>
          {analytics.questions.map((question, idx) => (
            <div key={question.question_index} className="border border-black rounded-lg p-7 bg-[#1a1f2e] shadow-sm">
              <div className="flex items-start justify-between mb-5">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-bold text-white text-lg">Question {question.question_number}</span>
                    {question.is_problematic && (
                      <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded">NEEDS REVIEW</span>
                    )}
                  </div>
                  <p className="text-gray-800 leading-relaxed">{question.question_text || '—'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-5 text-sm border-t border-b border-gray-300 py-4 bg-[#0f1419]">
                <div className="text-center">
                  <div className="text-gray-600 text-xs mb-1">Attempts</div>
                  <div className="font-bold text-white text-lg">{question.attempts || 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 text-xs mb-1">% Correct</div>
                  <div className={`font-bold text-lg ${question.correct_percentage < 40 ? 'text-red-600' : 'text-white'}`}>
                    {question.correct_percentage?.toFixed(1) || '0.0'}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 text-xs mb-1">Skip Rate</div>
                  <div className={`font-bold text-lg ${question.skip_rate > 20 ? 'text-red-600' : 'text-white'}`}>
                    {question.skip_rate?.toFixed(1) || '0.0'}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 text-xs mb-1">Avg Time</div>
                  <div className="font-bold text-white text-lg">{question.average_time_spent || 0}s</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 text-xs mb-1">Discrimination</div>
                  <div className="font-bold text-white text-lg">
                    {typeof question.discrimination_index === 'number' ? question.discrimination_index.toFixed(1) : 'N/A'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 text-xs mb-1">Most Chosen</div>
                  <div className="font-bold text-white text-lg">{question.most_chosen_option || '—'}</div>
                </div>
              </div>

              {question.flags && question.flags.length > 0 && (
                <div className="mb-5 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg" title={question.flag_tooltip || ''}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{question.flag_icon || '⚠️'}</span>
                    <span className="font-medium text-white">{question.flags.join(', ')}</span>
                  </div>
                  {question.flag_tooltip && (
                    <p className="text-xs text-gray-600 mt-1 ml-8">{question.flag_tooltip}</p>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Option Distribution</h4>
                {question.options.map((option) => {
                  const isCorrect = option.is_correct;
                  const barWidth = option.selection_percentage || 0;
                  const displayPercentage = option.selection_percentage?.toFixed(1) || '0.0';
                  
                  return (
                    <div key={option.option_index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="font-bold text-gray-700 w-8">{option.option_letter}</span>
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                          <span className={`${isCorrect ? 'font-semibold text-white' : 'text-gray-700'} flex-1`}>
                            {option.option_text || '—'}
                          </span>
                        </div>
                        <span className="font-bold text-white text-right ml-4 min-w-[80px]">
                          {option.selected_count || 0} ({displayPercentage}%)
                        </span>
                      </div>
                      <div className="h-3 bg-[#1a1f2e] rounded-lg border border-gray-300 overflow-hidden relative ml-11">
                        <div 
                          className="h-full bg-black rounded-lg transition-all duration-300 ease-out" 
                          style={{ width: barWidth + '%' }}
                        ></div>
                        {barWidth > 10 && (
                          <span className="absolute left-2 top-0 text-xs font-medium text-white leading-3">
                            {displayPercentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {idx < analytics.questions.length - 1 && (
                <div className="mt-6 border-t border-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


