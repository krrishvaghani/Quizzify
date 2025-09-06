import React from 'react';
import { TrendingUp, Target, Clock, Award } from 'lucide-react';

const ProgressTracker = ({ userStats }) => {
  const stats = userStats || {
    totalQuizzes: 0,
    averageScore: 0,
    timeSpent: 0,
    streak: 0,
    improvement: 0
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="progress-tracker">
      <div className="progress-header">
        <h2 className="progress-title">Your Learning Journey</h2>
        <p className="progress-subtitle">Track your progress and achievements</p>
      </div>
      
      <div className="progress-stats-grid">
        <div className="progress-stat-card">
          <div className="stat-icon-wrapper primary">
            <Target size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalQuizzes}</div>
            <div className="stat-label">Quizzes Completed</div>
          </div>
        </div>

        <div className="progress-stat-card">
          <div className="stat-icon-wrapper success">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.averageScore}%</div>
            <div className="stat-label">Average Score</div>
          </div>
        </div>

        <div className="progress-stat-card">
          <div className="stat-icon-wrapper warning">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{formatTime(stats.timeSpent)}</div>
            <div className="stat-label">Time Spent</div>
          </div>
        </div>

        <div className="progress-stat-card">
          <div className="stat-icon-wrapper accent">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.streak}</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>
      </div>

      <div className="progress-chart-container">
        <div className="progress-chart">
          <h3>Performance Trend</h3>
          <div className="chart-visual">
            <div className="trend-line">
              {[...Array(7)].map((_, i) => (
                <div 
                  key={i} 
                  className="trend-bar"
                  style={{ 
                    height: `${Math.random() * 60 + 20}%`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
            <div className="chart-labels">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <span key={day} className="chart-label">{day}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
