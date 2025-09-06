import React from 'react';
import { BarChart3, TrendingUp, Target, Award, Brain, Zap } from 'lucide-react';
import { DIFFICULTY_CONFIG } from '../utils/difficultyManager';

const DifficultyStatistics = ({ statistics }) => {
  const { totalQuestions, accuracy, difficultyBreakdown, currentStreak, difficultyChanges } = statistics;

  const getDifficultyIcon = (level) => {
    switch (level) {
      case 'easy': return <Zap size={16} />;
      case 'medium': return <Target size={16} />;
      case 'hard': return <Brain size={16} />;
      default: return <Target size={16} />;
    }
  };

  const getAccuracyColor = (acc) => {
    if (acc >= 80) return '#22c55e';
    if (acc >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="difficulty-statistics">
      <div className="stats-header">
        <div className="stats-icon">
          <BarChart3 size={24} />
        </div>
        <h3 className="stats-title">Adaptive Learning Progress</h3>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-value">{totalQuestions}</div>
          <div className="stat-label">Questions Answered</div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-value" style={{ color: getAccuracyColor(accuracy) }}>
            {accuracy}%
          </div>
          <div className="stat-label">Overall Accuracy</div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-value">{currentStreak}</div>
          <div className="stat-label">Current Streak</div>
        </div>
        
        <div className="stat-card info">
          <div className="stat-value">{difficultyChanges}</div>
          <div className="stat-label">Level Changes</div>
        </div>
      </div>

      <div className="difficulty-breakdown">
        <h4 className="breakdown-title">Performance by Difficulty</h4>
        <div className="breakdown-grid">
          {Object.entries(difficultyBreakdown).map(([level, data]) => {
            const config = DIFFICULTY_CONFIG[level];
            const levelAccuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
            
            return (
              <div key={level} className="breakdown-item">
                <div 
                  className="breakdown-header"
                  style={{ backgroundColor: config.bgColor }}
                >
                  <div className="breakdown-icon" style={{ color: config.color }}>
                    {getDifficultyIcon(level)}
                  </div>
                  <div className="breakdown-info">
                    <span className="breakdown-level">{config.label}</span>
                    <span className="breakdown-count">{data.total} questions</span>
                  </div>
                </div>
                
                <div className="breakdown-progress">
                  <div className="progress-bar-small">
                    <div 
                      className="progress-fill-small"
                      style={{ 
                        width: `${levelAccuracy}%`,
                        backgroundColor: config.color
                      }}
                    />
                  </div>
                  <span className="breakdown-accuracy">{levelAccuracy}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DifficultyStatistics;
