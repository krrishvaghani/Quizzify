import { useState, useEffect } from 'react'

function Dashboard() {
  const [quizHistory, setQuizHistory] = useState([])
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
    totalQuestions: 0
  })

  useEffect(() => {
    // Load quiz history from localStorage (in a real app, this would come from the backend)
    const history = JSON.parse(localStorage.getItem('quizHistory') || '[]')
    setQuizHistory(history)
    
    if (history.length > 0) {
      const totalQuizzes = history.length
      const totalQuestions = history.reduce((sum, quiz) => sum + quiz.totalQuestions, 0)
      const totalScore = history.reduce((sum, quiz) => sum + quiz.score, 0)
      const averageScore = totalScore / totalQuizzes
      const bestScore = Math.max(...history.map(quiz => quiz.score))
      
      setStats({
        totalQuizzes,
        averageScore: Math.round(averageScore * 100) / 100,
        bestScore,
        totalQuestions
      })
    }
  }, [])

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return 'text-success'
    if (percentage >= 60) return 'text-warning'
    return 'text-danger'
  }

  const getScoreEmoji = (score, total) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return '🎉'
    if (percentage >= 60) return '👍'
    return '💪'
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Your Learning Dashboard</h1>
        <p className="dashboard-subtitle">Track your progress and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalQuizzes}</div>
            <div className="stat-label">Total Quizzes</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{stats.averageScore}%</div>
            <div className="stat-label">Average Score</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-value">{stats.bestScore}%</div>
            <div className="stat-label">Best Score</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">❓</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalQuestions}</div>
            <div className="stat-label">Questions Answered</div>
          </div>
        </div>
      </div>

      {/* Quiz History */}
      <div className="history-section">
        <h2 className="section-title">Recent Quiz Results</h2>
        
        {quizHistory.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No quizzes taken yet</h3>
            <p>Complete your first quiz to see your results here!</p>
            <a href="/" className="btn-primary">Take a Quiz</a>
          </div>
        ) : (
          <div className="quiz-history">
            {quizHistory.map((quiz, index) => (
              <div key={index} className="quiz-result-card">
                <div className="quiz-result-header">
                  <div className="quiz-info">
                    <h3 className="quiz-title">{quiz.title || `Quiz ${index + 1}`}</h3>
                    <p className="quiz-date">{new Date(quiz.date).toLocaleDateString()}</p>
                  </div>
                  <div className="quiz-score">
                    <span className={`score-badge ${getScoreColor(quiz.score, quiz.totalQuestions)}`}>
                      {getScoreEmoji(quiz.score, quiz.totalQuestions)} {quiz.score}/{quiz.totalQuestions}
                    </span>
                    <div className="score-percentage">
                      {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                    </div>
                  </div>
                </div>
                
                {quiz.incorrectAnswers && quiz.incorrectAnswers.length > 0 && (
                  <div className="incorrect-answers">
                    <h4>Areas for Improvement:</h4>
                    <ul className="incorrect-list">
                      {quiz.incorrectAnswers.map((answer, idx) => (
                        <li key={idx} className="incorrect-item">
                          <span className="question-text">{answer.question}</span>
                          <div className="answer-details">
                            <span className="your-answer">Your answer: {answer.yourAnswer}</span>
                            <span className="correct-answer">Correct: {answer.correctAnswer}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress Chart Placeholder */}
      <div className="progress-section">
        <h2 className="section-title">Learning Progress</h2>
        <div className="progress-chart">
          <div className="chart-placeholder">
            <div className="chart-icon">📈</div>
            <p>Progress visualization coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
