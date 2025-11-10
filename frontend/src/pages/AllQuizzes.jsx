import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizAPI } from '../utils/api';
import {
  BookOpen,
  Loader2,
  FileText,
  Clock,
  PlayCircle,
  Search,
  ArrowLeft,
} from 'lucide-react';

export default function AllQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
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
    <div className="min-h-screen bg-[#0f1419]">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search all quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#252b3b] border-2 border-[#2d3548] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all font-medium shadow-lg"
            />
          </div>
        </div>

        {/* Quiz Count */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            {searchQuery ? `Search Results (${filteredQuizzes.length})` : `All Available Quizzes (${filteredQuizzes.length})`}
          </h2>
          <p className="text-gray-400 mt-2 text-sm">Browse and take quizzes from the community</p>
        </div>

        {/* Quizzes Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
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
            <p className="text-gray-400 text-sm">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'No quizzes available at the moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuizzes.map((quiz) => {
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
        )}
      </main>
    </div>
  );
}
