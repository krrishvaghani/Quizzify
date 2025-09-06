import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Clock, RotateCcw, Trophy, Target, BookOpen, Activity } from 'lucide-react';
import AIChatbot from '../components/chat/AIChatbot';
import { useChatbot } from '../components/chat/ChatProvider';

function Dashboard() {
  const [quizHistory, setQuizHistory] = useState([])
  const [progressStats, setProgressStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    weakestSubject: null,
    strongestSubject: null,
    totalTimeSpent: 0,
    improvementTrend: 0
  })
  const navigate = useNavigate()
  const { isChatOpen, toggleChat } = useChatbot()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    const history = JSON.parse(localStorage.getItem('quizHistory') || '[]')
    setQuizHistory(history.slice(0, 5)) // Only keep last 5 for recent activity
    
    if (history.length > 0) {
      calculateProgressStats(history)
    }
  }

  const calculateProgressStats = (history) => {
    const totalQuizzes = history.length
    const totalScore = history.reduce((sum, quiz) => sum + quiz.score, 0)
    const totalQuestions = history.reduce((sum, quiz) => sum + quiz.totalQuestions, 0)
    const averageScore = Math.round((totalScore / totalQuestions) * 100)

    // Calculate subject performance from adaptive stats
    const subjectPerformance = {}
    let totalTimeSpent = 0

    history.forEach(quiz => {
      // Extract subject from title or use 'General' as default
      const subject = quiz.title?.includes('Quiz - ') 
        ? quiz.title.split('Quiz - ')[1]?.split(' ')[0] || 'General'
        : 'General'
      
      if (!subjectPerformance[subject]) {
        subjectPerformance[subject] = { correct: 0, total: 0 }
      }
      
      subjectPerformance[subject].correct += quiz.score
      subjectPerformance[subject].total += quiz.totalQuestions

      // Calculate time spent (estimate if not available)
      if (quiz.results) {
        totalTimeSpent += quiz.results.reduce((sum, result) => sum + (result.timeTaken || 30), 0)
      } else {
        totalTimeSpent += quiz.totalQuestions * 30 // 30 seconds average per question
      }
    })

    // Find weakest and strongest subjects
    let weakestSubject = null
    let strongestSubject = null
    let lowestPercentage = 100
    let highestPercentage = 0

    Object.entries(subjectPerformance).forEach(([subject, performance]) => {
      const percentage = (performance.correct / performance.total) * 100
      
      if (percentage < lowestPercentage) {
        lowestPercentage = percentage
        weakestSubject = { name: subject, percentage: Math.round(percentage) }
      }
      
      if (percentage > highestPercentage) {
        highestPercentage = percentage
        strongestSubject = { name: subject, percentage: Math.round(percentage) }
      }
    })

    // Calculate improvement trend (compare last 3 vs first 3 quizzes)
    let improvementTrend = 0
    if (history.length >= 6) {
      const recent = history.slice(0, 3)
      const older = history.slice(-3)
      
      const recentAvg = recent.reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions), 0) / 3
      const olderAvg = older.reduce((sum, quiz) => sum + (quiz.score / quiz.totalQuestions), 0) / 3
      
      improvementTrend = Math.round((recentAvg - olderAvg) * 100)
    }

    setProgressStats({
      totalQuizzes,
      averageScore,
      weakestSubject,
      strongestSubject,
      totalTimeSpent: Math.round(totalTimeSpent / 60), // Convert to minutes
      improvementTrend
    })
  }

  const handleRetakeQuiz = (quiz) => {
    // Navigate to quiz creation with similar settings
    navigate('/', { 
      state: { 
        retakeQuiz: true,
        originalTitle: quiz.title,
        questionCount: quiz.totalQuestions 
      }
    })
  }

  const formatTimeSpent = (minutes) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return '#22c55e'
    if (percentage >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const getPerformanceIcon = (percentage) => {
    if (percentage >= 80) return '🎯'
    if (percentage >= 60) return '📈'
    return '📉'
  }

  return (
    <div className="modern-dashboard">
      {/* Header */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1 className="hero-title">Learning Dashboard</h1>
          <p className="hero-subtitle">Track your progress with adaptive learning insights</p>
        </div>
        <div className="hero-stats">
          <div className="quick-stat">
            <Activity size={24} />
            <span>{progressStats.totalQuizzes} Quizzes</span>
          </div>
          <div className="quick-stat">
            <Clock size={24} />
            <span>{formatTimeSpent(progressStats.totalTimeSpent)} Studied</span>
          </div>
        </div>
      </div>

      {/* User Progress Overview */}
      <div className="progress-overview">
        <h2 className="section-title">
          <Target size={20} />
          Progress Overview
        </h2>
        
        <div className="progress-grid">
          <div className="progress-card primary">
            <div className="card-header">
              <Trophy size={24} />
              <span className="card-title">Total Quizzes</span>
            </div>
            <div className="card-value">{progressStats.totalQuizzes}</div>
            <div className="card-subtitle">Completed successfully</div>
          </div>

          <div className="progress-card success">
            <div className="card-header">
              <Target size={24} />
              <span className="card-title">Average Score</span>
            </div>
            <div className="card-value">{progressStats.averageScore}%</div>
            <div className="card-subtitle">
              {progressStats.improvementTrend > 0 ? (
                <span className="trend positive">
                  <TrendingUp size={16} />
                  +{progressStats.improvementTrend}% improvement
                </span>
              ) : progressStats.improvementTrend < 0 ? (
                <span className="trend negative">
                  <TrendingDown size={16} />
                  {progressStats.improvementTrend}% decline
                </span>
              ) : (
                <span>Steady performance</span>
              )}
            </div>
          </div>

          <div className="progress-card warning">
            <div className="card-header">
              <BookOpen size={24} />
              <span className="card-title">Weakest Subject</span>
            </div>
            <div className="card-value">
              {progressStats.weakestSubject ? progressStats.weakestSubject.name : 'N/A'}
            </div>
            <div className="card-subtitle">
              {progressStats.weakestSubject ? 
                `${progressStats.weakestSubject.percentage}% accuracy` : 
                'Take more quizzes'
              }
            </div>
          </div>

          <div className="progress-card info">
            <div className="card-header">
              <Trophy size={24} />
              <span className="card-title">Strongest Subject</span>
            </div>
            <div className="card-value">
              {progressStats.strongestSubject ? progressStats.strongestSubject.name : 'N/A'}
            </div>
            <div className="card-subtitle">
              {progressStats.strongestSubject ? 
                `${progressStats.strongestSubject.percentage}% accuracy` : 
                'Take more quizzes'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2 className="section-title">
          <Activity size={20} />
          Recent Activity
        </h2>

        {quizHistory.length === 0 ? (
          <div className="empty-state-modern">
            <div className="empty-icon">🎯</div>
            <h3>Ready to start learning?</h3>
            <p>Take your first adaptive quiz and watch your progress grow!</p>
            <button 
              className="btn-primary-modern"
              onClick={() => navigate('/')}
            >
              <BookOpen size={20} />
              Create Your First Quiz
            </button>
          </div>
        ) : (
          <div className="activity-list">
            {quizHistory.map((quiz, index) => (
              <div key={index} className="activity-card">
                <div className="activity-main">
                  <div className="activity-info">
                    <div className="activity-header">
                      <h3 className="activity-title">{quiz.title || `Quiz ${index + 1}`}</h3>
                      <span className="activity-date">
                        {new Date(quiz.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="activity-details">
                      <span className="detail-item">
                        <Target size={16} />
                        {quiz.totalQuestions} questions
                      </span>
                      {quiz.results && (
                        <span className="detail-item">
                          <Clock size={16} />
                          {Math.round(quiz.results.reduce((sum, r) => sum + (r.timeTaken || 30), 0) / 60)}m
                        </span>
                      )}
                      {quiz.adaptiveStats && (
                        <span className="detail-item adaptive-badge">
                          🧠 Adaptive
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="activity-score">
                    <div 
                      className="score-circle"
                      style={{ 
                        background: `conic-gradient(${getScoreColor(quiz.score, quiz.totalQuestions)} ${(quiz.score / quiz.totalQuestions) * 360}deg, #f1f5f9 0deg)`
                      }}
                    >
                      <div className="score-inner">
                        <span className="score-percentage">
                          {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                        </span>
                        <span className="score-fraction">
                          {quiz.score}/{quiz.totalQuestions}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="activity-actions">
                  <button 
                    className="btn-retake"
                    onClick={() => handleRetakeQuiz(quiz)}
                  >
                    <RotateCcw size={16} />
                    Retake Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Chatbot */}
      <AIChatbot 
        isOpen={isChatOpen} 
        onToggle={toggleChat}
        currentTopic="Dashboard"
      />
    </div>
  )
}

export default Dashboard
