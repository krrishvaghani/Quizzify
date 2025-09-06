import React, { useState } from 'react';
import { Bookmark, Plus, RotateCcw, Clock, Target, Hash, Settings, Save, Play } from 'lucide-react';

const QuizManagement = () => {
  const [activeTab, setActiveTab] = useState('saved');
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);

  const savedQuizzes = [
    {
      id: 1,
      title: 'Advanced Mathematics',
      topic: 'Math',
      difficulty: 'Hard',
      questions: 15,
      timeLimit: 20,
      lastAttempt: '2 days ago',
      bestScore: 88
    },
    {
      id: 2,
      title: 'World History Quiz',
      topic: 'History',
      difficulty: 'Medium',
      questions: 12,
      timeLimit: 15,
      lastAttempt: '1 week ago',
      bestScore: 76
    },
    {
      id: 3,
      title: 'Science Fundamentals',
      topic: 'Science',
      difficulty: 'Easy',
      questions: 10,
      timeLimit: 12,
      lastAttempt: 'Never',
      bestScore: null
    }
  ];

  const retakeQuizzes = [
    {
      id: 1,
      title: 'Literature Analysis',
      incorrectQuestions: 4,
      totalQuestions: 15,
      lastScore: 73,
      topic: 'Literature'
    },
    {
      id: 2,
      title: 'Geography Challenge',
      incorrectQuestions: 6,
      totalQuestions: 20,
      lastScore: 70,
      topic: 'Geography'
    }
  ];

  const [customQuiz, setCustomQuiz] = useState({
    title: '',
    topic: 'math',
    difficulty: 'medium',
    questions: 10,
    timeLimit: 15,
    adaptiveDifficulty: false
  });

  const handleCustomQuizChange = (field, value) => {
    setCustomQuiz(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="quiz-management-section">
      <div className="management-header">
        <h2 className="section-title">Quiz Management</h2>
        <p className="section-subtitle">Manage your saved quizzes and create custom ones</p>
      </div>

      {/* Tab Navigation */}
      <div className="management-tabs">
        <button 
          className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <Bookmark size={18} />
          Saved Quizzes
        </button>
        <button 
          className={`tab-btn ${activeTab === 'retake' ? 'active' : ''}`}
          onClick={() => setActiveTab('retake')}
        >
          <RotateCcw size={18} />
          Retake Options
        </button>
        <button 
          className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
          onClick={() => setActiveTab('custom')}
        >
          <Plus size={18} />
          Create Custom
        </button>
      </div>

      {/* Saved Quizzes Tab */}
      {activeTab === 'saved' && (
        <div className="saved-quizzes">
          <div className="quizzes-grid">
            {savedQuizzes.map(quiz => (
              <div key={quiz.id} className="quiz-card">
                <div className="quiz-header">
                  <h3 className="quiz-title">{quiz.title}</h3>
                  <div className="quiz-badges">
                    <span className={`topic-badge ${quiz.topic.toLowerCase()}`}>
                      {quiz.topic}
                    </span>
                    <span className={`difficulty-badge ${quiz.difficulty.toLowerCase()}`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                </div>
                
                <div className="quiz-stats">
                  <div className="stat-item">
                    <Hash size={16} />
                    <span>{quiz.questions} questions</span>
                  </div>
                  <div className="stat-item">
                    <Clock size={16} />
                    <span>{quiz.timeLimit} min</span>
                  </div>
                  {quiz.bestScore && (
                    <div className="stat-item">
                      <Target size={16} />
                      <span>Best: {quiz.bestScore}%</span>
                    </div>
                  )}
                </div>

                <div className="quiz-meta">
                  <span className="last-attempt">Last attempt: {quiz.lastAttempt}</span>
                </div>

                <div className="quiz-actions">
                  <button className="btn-secondary">
                    <Bookmark size={16} />
                    Remove
                  </button>
                  <button className="btn-primary">
                    <Play size={16} />
                    Start Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Retake Options Tab */}
      {activeTab === 'retake' && (
        <div className="retake-options">
          <div className="retake-grid">
            {retakeQuizzes.map(quiz => (
              <div key={quiz.id} className="retake-card">
                <div className="retake-header">
                  <h3 className="retake-title">{quiz.title}</h3>
                  <span className={`topic-badge ${quiz.topic.toLowerCase()}`}>
                    {quiz.topic}
                  </span>
                </div>
                
                <div className="retake-stats">
                  <div className="incorrect-count">
                    <span className="count-number">{quiz.incorrectQuestions}</span>
                    <span className="count-label">incorrect answers</span>
                  </div>
                  <div className="score-info">
                    <span>Last Score: {quiz.lastScore}%</span>
                    <span>Total Questions: {quiz.totalQuestions}</span>
                  </div>
                </div>

                <div className="retake-actions">
                  <button className="btn-secondary">
                    <RotateCcw size={16} />
                    Retake Incorrect Only
                  </button>
                  <button className="btn-primary">
                    <Play size={16} />
                    Retake Full Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Quiz Builder Tab */}
      {activeTab === 'custom' && (
        <div className="custom-quiz-builder">
          <div className="builder-form">
            <h3 className="builder-title">
              <Settings size={20} />
              Custom Quiz Builder
            </h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Quiz Title</label>
                <input
                  type="text"
                  value={customQuiz.title}
                  onChange={(e) => handleCustomQuizChange('title', e.target.value)}
                  placeholder="Enter quiz title..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Topic</label>
                <select
                  value={customQuiz.topic}
                  onChange={(e) => handleCustomQuizChange('topic', e.target.value)}
                  className="form-select"
                >
                  <option value="math">Mathematics</option>
                  <option value="science">Science</option>
                  <option value="history">History</option>
                  <option value="literature">Literature</option>
                  <option value="geography">Geography</option>
                  <option value="technology">Technology</option>
                </select>
              </div>

              <div className="form-group">
                <label>Difficulty Level</label>
                <select
                  value={customQuiz.difficulty}
                  onChange={(e) => handleCustomQuizChange('difficulty', e.target.value)}
                  className="form-select"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label>Number of Questions</label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={customQuiz.questions}
                  onChange={(e) => handleCustomQuizChange('questions', parseInt(e.target.value))}
                  className="form-range"
                />
                <span className="range-value">{customQuiz.questions} questions</span>
              </div>

              <div className="form-group">
                <label>Time Limit (minutes)</label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={customQuiz.timeLimit}
                  onChange={(e) => handleCustomQuizChange('timeLimit', parseInt(e.target.value))}
                  className="form-range"
                />
                <span className="range-value">{customQuiz.timeLimit} minutes</span>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={customQuiz.adaptiveDifficulty}
                    onChange={(e) => handleCustomQuizChange('adaptiveDifficulty', e.target.checked)}
                    className="form-checkbox"
                  />
                  <span>Enable Adaptive Difficulty</span>
                </label>
              </div>
            </div>

            <div className="builder-actions">
              <button className="btn-secondary">
                <Save size={16} />
                Save for Later
              </button>
              <button className="btn-primary">
                <Play size={16} />
                Create & Start Quiz
              </button>
            </div>
          </div>

          <div className="quiz-preview">
            <h4>Quiz Preview</h4>
            <div className="preview-card">
              <h5>{customQuiz.title || 'Untitled Quiz'}</h5>
              <div className="preview-details">
                <span>Topic: {customQuiz.topic}</span>
                <span>Difficulty: {customQuiz.difficulty}</span>
                <span>Questions: {customQuiz.questions}</span>
                <span>Time: {customQuiz.timeLimit} min</span>
                {customQuiz.adaptiveDifficulty && <span>✓ Adaptive</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManagement;
