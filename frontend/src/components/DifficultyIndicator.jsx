import React from 'react';
import { TrendingUp, TrendingDown, Target, Award, Brain, Zap } from 'lucide-react';
import { DIFFICULTY_CONFIG } from '../utils/difficultyManager';

const DifficultyIndicator = ({ difficultyInfo, showProgress = true, compact = false }) => {
  const { level, config, consecutiveCorrect, consecutiveWrong, progressToNext } = difficultyInfo;

  const getDifficultyIcon = (level) => {
    switch (level) {
      case 'easy': return <Zap size={20} />;
      case 'medium': return <Target size={20} />;
      case 'hard': return <Brain size={20} />;
      default: return <Target size={20} />;
    }
  };

  const getProgressIcon = () => {
    if (progressToNext.type === 'advance') return <TrendingUp size={16} />;
    if (progressToNext.type === 'recover') return <TrendingUp size={16} />;
    return <Award size={16} />;
  };

  if (compact) {
    return (
      <div className="difficulty-indicator-compact">
        <div 
          className="difficulty-badge"
          style={{ 
            backgroundColor: config.bgColor,
            color: config.color,
            border: `1px solid ${config.color}30`
          }}
        >
          {getDifficultyIcon(level)}
          <span>{config.label}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="difficulty-indicator">
      <div className="difficulty-header">
        <div 
          className="difficulty-level"
          style={{ 
            backgroundColor: config.bgColor,
            borderLeft: `4px solid ${config.color}`
          }}
        >
          <div className="difficulty-icon" style={{ color: config.color }}>
            {getDifficultyIcon(level)}
          </div>
          <div className="difficulty-info">
            <h3 className="difficulty-title">{config.label} Level</h3>
            <p className="difficulty-description">{config.description}</p>
          </div>
        </div>
      </div>

      {showProgress && (
        <div className="difficulty-progress">
          <div className="progress-header">
            <div className="progress-icon" style={{ color: config.color }}>
              {getProgressIcon()}
            </div>
            <span className="progress-message">{progressToNext.message}</span>
          </div>
          
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(progressToNext.current / progressToNext.target) * 100}%`,
                  backgroundColor: config.color
                }}
              />
            </div>
            <span className="progress-text">
              {progressToNext.current}/{progressToNext.target}
            </span>
          </div>

          {(consecutiveCorrect > 0 || consecutiveWrong > 0) && (
            <div className="streak-info">
              {consecutiveCorrect > 0 && (
                <div className="streak correct-streak">
                  <span className="streak-icon">🔥</span>
                  <span>{consecutiveCorrect} correct in a row</span>
                </div>
              )}
              {consecutiveWrong > 0 && (
                <div className="streak wrong-streak">
                  <span className="streak-icon">💪</span>
                  <span>Keep trying! {consecutiveWrong} to review</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DifficultyIndicator;
