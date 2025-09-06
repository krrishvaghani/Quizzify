import React from 'react';
import { Trophy, Target, Clock, TrendingUp, Award, Zap, Star, Medal } from 'lucide-react';

const UserProgress = ({ userStats }) => {
  const stats = userStats || {
    totalQuizzes: 24,
    averageScore: 87,
    totalCorrect: 156,
    totalQuestions: 180,
    averageTime: 45,
    currentStreak: 7,
    longestStreak: 12,
    badges: ['Fast Thinker', 'Topic Master', 'Consistent Learner']
  };

  const accuracy = Math.round((stats.totalCorrect / stats.totalQuestions) * 100);

  const badges = [
    { name: 'Fast Thinker', icon: Zap, color: 'warning', description: 'Answer 10 questions in under 30 seconds each' },
    { name: 'Topic Master', icon: Star, color: 'primary', description: 'Score 90%+ in any topic 5 times' },
    { name: 'Consistent Learner', icon: Target, color: 'success', description: 'Complete quizzes for 7 days straight' },
    { name: 'Perfect Score', icon: Medal, color: 'accent', description: 'Get 100% on any quiz' },
    { name: 'Quiz Champion', icon: Trophy, color: 'secondary', description: 'Complete 50 quizzes' }
  ];

  return (
    <div className="user-progress-section">
      <div className="progress-header">
        <h2 className="section-title">Your Progress & Performance</h2>
        <p className="section-subtitle">Track your learning journey and achievements</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">
            <Trophy size={28} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{stats.averageScore}%</div>
            <div className="metric-label">Average Score</div>
            <div className="metric-trend positive">+5% this week</div>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">
            <Target size={28} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{accuracy}%</div>
            <div className="metric-label">Accuracy Rate</div>
            <div className="metric-detail">{stats.totalCorrect}/{stats.totalQuestions} correct</div>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-icon">
            <Clock size={28} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{stats.averageTime}s</div>
            <div className="metric-label">Avg Time/Question</div>
            <div className="metric-trend negative">-3s improved</div>
          </div>
        </div>

        <div className="metric-card accent">
          <div className="metric-icon">
            <TrendingUp size={28} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{stats.currentStreak}</div>
            <div className="metric-label">Current Streak</div>
            <div className="metric-detail">Best: {stats.longestStreak} days</div>
          </div>
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="achievements-section">
        <h3 className="subsection-title">
          <Award size={20} />
          Badges & Achievements
        </h3>
        <div className="badges-grid">
          {badges.map((badge, index) => {
            const IconComponent = badge.icon;
            const isEarned = stats.badges.includes(badge.name);
            
            return (
              <div key={index} className={`badge-card ${isEarned ? 'earned' : 'locked'} ${badge.color}`}>
                <div className="badge-icon">
                  <IconComponent size={24} />
                </div>
                <div className="badge-content">
                  <h4 className="badge-name">{badge.name}</h4>
                  <p className="badge-description">{badge.description}</p>
                  {isEarned && <div className="badge-earned">✓ Earned</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Performance */}
      <div className="recent-performance">
        <h3 className="subsection-title">Recent Quiz History</h3>
        <div className="performance-list">
          {[
            { topic: 'Mathematics', score: 92, time: '3:45', date: '2 hours ago', difficulty: 'Medium' },
            { topic: 'Science', score: 88, time: '4:12', date: '1 day ago', difficulty: 'Hard' },
            { topic: 'History', score: 76, time: '5:30', date: '2 days ago', difficulty: 'Easy' },
            { topic: 'Literature', score: 94, time: '3:20', date: '3 days ago', difficulty: 'Medium' }
          ].map((quiz, index) => (
            <div key={index} className="performance-item">
              <div className="quiz-info">
                <h4 className="quiz-topic">{quiz.topic}</h4>
                <span className={`difficulty-badge ${quiz.difficulty.toLowerCase()}`}>
                  {quiz.difficulty}
                </span>
              </div>
              <div className="quiz-metrics">
                <div className="quiz-score">
                  <span className="score-value">{quiz.score}%</span>
                  <span className="score-label">Score</span>
                </div>
                <div className="quiz-time">
                  <span className="time-value">{quiz.time}</span>
                  <span className="time-label">Duration</span>
                </div>
                <div className="quiz-date">{quiz.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProgress;
