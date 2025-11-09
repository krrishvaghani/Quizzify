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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-black" />
              </div>
              <h1 className="text-xl font-bold text-white">All Quizzes</h1>
            </div>

            <div className="w-32"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

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
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>

        {/* Quiz Count */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black">
            {searchQuery ? `Search Results (${filteredQuizzes.length})` : `All Available Quizzes (${filteredQuizzes.length})`}
          </h2>
          <p className="text-gray-600 mt-1">Browse and take quizzes from the community</p>
        </div>

        {/* Quizzes Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-3" />
            <p className="text-gray-600">Loading quizzes...</p>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="text-center py-16 px-6 bg-gray-50 rounded-xl border border-gray-300">
            <FileText className="h-12 w-12 text-gray-400 mb-4 mx-auto" />
            <h3 className="text-xl font-bold text-black mb-2">
              {searchQuery ? 'No quizzes found' : 'No quizzes yet'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'No quizzes available at the moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => {
              const isMyQuiz = quiz.created_by === user?.email
              
              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-xl border border-gray-300 hover:border-black transition-all duration-200 overflow-hidden group hover:shadow-lg"
                >
                  {/* Quiz Icon/Header */}
                  <div className="bg-black p-6 relative">
                    <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                      <BookOpen className="h-7 w-7 text-black" />
                    </div>
                    {/* Creator Badge */}
                    {isMyQuiz ? (
                      <span className="absolute top-3 right-3 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                        My Quiz
                      </span>
                    ) : (
                      <span className="absolute top-3 right-3 px-2 py-1 bg-gray-700 text-white text-xs font-medium rounded-full">
                        Public
                      </span>
                    )}
                  </div>

                  {/* Quiz Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
                      {quiz.title}
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-600">
                        {getQuizCategory(quiz)}
                      </p>
                      {!isMyQuiz && quiz.created_by && (
                        <p className="text-xs text-gray-500 italic">
                          by {quiz.created_by.split('@')[0]}
                        </p>
                      )}
                    </div>

                    {/* Quiz Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{quiz.questions?.length || 0} Questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{getQuizTimeLimit(quiz)}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      to={`/quiz/${quiz.id}/start`}
                      className="w-full py-2.5 bg-black text-white rounded-xl font-medium hover:bg-gray-800 flex items-center justify-center gap-2 transition-all"
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
