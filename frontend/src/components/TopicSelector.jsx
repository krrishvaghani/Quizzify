import { useState } from 'react'
import { BookOpen, Calculator, Atom, Globe, Laptop, Scroll, Brain } from 'lucide-react'

const TopicSelector = ({ selectedTopic, onTopicChange, availableTopics = [] }) => {
  const topicIcons = {
    math: Calculator,
    science: Atom,
    history: Scroll,
    literature: BookOpen,
    geography: Globe,
    technology: Laptop,
    general: Brain
  }

  const topicColors = {
    math: '#3b82f6',
    science: '#10b981',
    history: '#f59e0b',
    literature: '#8b5cf6',
    geography: '#06b6d4',
    technology: '#6366f1',
    general: '#64748b'
  }

  const formatTopicName = (topic) => {
    return topic.charAt(0).toUpperCase() + topic.slice(1)
  }

  return (
    <div className="topic-selector">
      <h3 className="topic-selector-title">Select Quiz Topic</h3>
      <div className="topic-grid">
        {availableTopics.map(topic => {
          const IconComponent = topicIcons[topic] || Brain
          const isSelected = selectedTopic === topic
          
          return (
            <button
              key={topic}
              className={`topic-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onTopicChange(topic)}
              style={{
                '--topic-color': topicColors[topic] || '#64748b'
              }}
            >
              <div className="topic-icon">
                <IconComponent size={24} />
              </div>
              <span className="topic-name">
                {formatTopicName(topic)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TopicSelector
