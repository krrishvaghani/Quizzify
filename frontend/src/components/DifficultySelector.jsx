import { useState } from 'react'
import { Zap, Target, Flame } from 'lucide-react'

const DifficultySelector = ({ selectedDifficulty, onDifficultyChange, userRecommendation = null }) => {
  const difficulties = [
    {
      value: 'easy',
      label: 'Easy',
      icon: Zap,
      color: '#10b981',
      description: 'Perfect for beginners'
    },
    {
      value: 'medium',
      label: 'Medium',
      icon: Target,
      color: '#f59e0b',
      description: 'Balanced challenge'
    },
    {
      value: 'hard',
      label: 'Hard',
      icon: Flame,
      color: '#ef4444',
      description: 'Expert level'
    }
  ]

  return (
    <div className="difficulty-selector">
      <h3 className="difficulty-selector-title">Select Difficulty Level</h3>
      {userRecommendation && (
        <div className="ai-recommendation">
          <span className="recommendation-text">
            🤖 AI Recommends: <strong>{userRecommendation}</strong>
          </span>
        </div>
      )}
      <div className="difficulty-grid">
        {difficulties.map(difficulty => {
          const IconComponent = difficulty.icon
          const isSelected = selectedDifficulty === difficulty.value
          const isRecommended = userRecommendation === difficulty.value
          
          return (
            <button
              key={difficulty.value}
              className={`difficulty-card ${isSelected ? 'selected' : ''} ${isRecommended ? 'recommended' : ''}`}
              onClick={() => onDifficultyChange(difficulty.value)}
              style={{
                '--difficulty-color': difficulty.color
              }}
            >
              <div className="difficulty-icon">
                <IconComponent size={24} />
              </div>
              <div className="difficulty-content">
                <span className="difficulty-name">{difficulty.label}</span>
                <span className="difficulty-description">{difficulty.description}</span>
              </div>
              {isRecommended && (
                <div className="recommendation-badge">Recommended</div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default DifficultySelector
