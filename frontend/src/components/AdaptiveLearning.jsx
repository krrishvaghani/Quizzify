import React from 'react';
import { Brain, Target, TrendingUp, BookOpen, Lightbulb, ArrowRight, Star, AlertCircle } from 'lucide-react';

const AdaptiveLearning = ({ userPerformance }) => {
  // Sample adaptive learning data
  const recommendations = [
    {
      type: 'weakness',
      topic: 'History',
      message: 'You scored 65% in History. Try focusing on World War topics.',
      action: 'Take History Quiz',
      priority: 'high',
      icon: AlertCircle
    },
    {
      type: 'strength',
      topic: 'Mathematics',
      message: 'Excellent work in Math! You\'re ready for advanced topics.',
      action: 'Try Advanced Math',
      priority: 'medium',
      icon: Star
    },
    {
      type: 'suggestion',
      topic: 'Science',
      message: 'Based on your interests, try Physics fundamentals.',
      action: 'Start Physics Quiz',
      priority: 'low',
      icon: Lightbulb
    }
  ];

  const aiSuggestions = [
    {
      title: 'Personalized Quiz Mix',
      description: 'Based on your mistakes, we recommend: 40% History, 30% Science, 30% Literature',
      topics: ['Ancient Civilizations', 'Chemical Reactions', 'Poetry Analysis']
    },
    {
      title: 'Difficulty Progression',
      description: 'You\'re ready to move from Medium to Hard difficulty in Mathematics',
      currentLevel: 'Medium',
      suggestedLevel: 'Hard',
      confidence: 85
    },
    {
      title: 'Learning Path',
      description: 'Complete these topics in order for optimal learning',
      path: ['Basic Algebra', 'Linear Equations', 'Quadratic Functions', 'Calculus Intro']
    }
  ];

  const difficultyProgress = {
    easy: { completed: 45, total: 50, percentage: 90 },
    medium: { completed: 32, total: 40, percentage: 80 },
    hard: { completed: 12, total: 30, percentage: 40 }
  };

  return (
    <div className="adaptive-learning-section">
      <div className="adaptive-header">
        <h2 className="section-title">
          <Brain size={24} />
          Adaptive Learning Insights
        </h2>
        <p className="section-subtitle">Personalized recommendations powered by AI</p>
      </div>

      {/* Personalized Recommendations */}
      <div className="recommendations-grid">
        <h3 className="subsection-title">Personalized Recommendations</h3>
        {recommendations.map((rec, index) => (
          <div key={index} className={`recommendation-card ${rec.type} ${rec.priority}`}>
            <div className="rec-icon">
              <rec.icon size={20} />
            </div>
            <div className="rec-content">
              <h4 className="rec-topic">{rec.topic}</h4>
              <p className="rec-message">{rec.message}</p>
              <button className="rec-action">
                {rec.action}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Suggestions */}
      <div className="ai-suggestions">
        <h3 className="subsection-title">
          <Lightbulb size={20} />
          AI-Generated Suggestions
        </h3>
        <div className="suggestions-grid">
          {aiSuggestions.map((suggestion, index) => (
            <div key={index} className="suggestion-card">
              <h4 className="suggestion-title">{suggestion.title}</h4>
              <p className="suggestion-description">{suggestion.description}</p>
              
              {suggestion.topics && (
                <div className="suggestion-topics">
                  <span className="topics-label">Recommended Topics:</span>
                  <div className="topics-list">
                    {suggestion.topics.map((topic, i) => (
                      <span key={i} className="topic-tag">{topic}</span>
                    ))}
                  </div>
                </div>
              )}

              {suggestion.currentLevel && (
                <div className="difficulty-suggestion">
                  <div className="level-progression">
                    <span className="current-level">{suggestion.currentLevel}</span>
                    <ArrowRight size={16} />
                    <span className="suggested-level">{suggestion.suggestedLevel}</span>
                  </div>
                  <div className="confidence-meter">
                    <span>Confidence: {suggestion.confidence}%</span>
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill" 
                        style={{ width: `${suggestion.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {suggestion.path && (
                <div className="learning-path">
                  <span className="path-label">Learning Path:</span>
                  <div className="path-steps">
                    {suggestion.path.map((step, i) => (
                      <div key={i} className="path-step">
                        <span className="step-number">{i + 1}</span>
                        <span className="step-name">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Difficulty Curve */}
      <div className="difficulty-curve">
        <h3 className="subsection-title">
          <TrendingUp size={20} />
          Difficulty Progression
        </h3>
        <div className="difficulty-levels">
          {Object.entries(difficultyProgress).map(([level, data]) => (
            <div key={level} className="difficulty-level">
              <div className="level-header">
                <span className="level-name">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
                <span className="level-progress">{data.completed}/{data.total}</span>
              </div>
              <div className="level-bar">
                <div 
                  className={`level-fill ${level}`}
                  style={{ width: `${data.percentage}%` }}
                ></div>
              </div>
              <span className="level-percentage">{data.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3 className="subsection-title">Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-btn primary">
            <Target size={20} />
            <span>Focus on Weak Areas</span>
          </button>
          <button className="action-btn secondary">
            <BookOpen size={20} />
            <span>Custom Quiz Builder</span>
          </button>
          <button className="action-btn accent">
            <Brain size={20} />
            <span>AI Study Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveLearning;
