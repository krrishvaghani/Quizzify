import React from 'react';
import { FileText, BookOpen } from 'lucide-react';

const QuizModeSelector = ({ selectedMode, onModeChange }) => {
  const modes = [
    {
      id: 'document',
      title: 'Document-Based Quiz',
      description: 'Upload a document and generate questions from it',
      icon: FileText,
      color: 'emerald'
    },
    {
      id: 'topic',
      title: 'Topic-Based Quiz',
      description: 'Choose from predefined topics and difficulty levels',
      icon: BookOpen,
      color: 'amber'
    }
  ];

  return (
    <div className="quiz-mode-section">
      <h2 className="section-title">Choose Quiz Mode</h2>
      <div className="mode-cards-container">
        {modes.map((mode) => {
          const IconComponent = mode.icon;
          return (
            <div
              key={mode.id}
              className={`mode-card ${selectedMode === mode.id ? 'selected' : ''}`}
              onClick={() => onModeChange(mode.id)}
            >
              <div className={`mode-icon ${mode.color}`}>
                <IconComponent size={32} />
              </div>
              <div className="mode-content">
                <h3 className="mode-title">{mode.title}</h3>
                <p className="mode-description">{mode.description}</p>
              </div>
              <div className="mode-selector">
                <div className={`radio-button ${selectedMode === mode.id ? 'checked' : ''}`}>
                  {selectedMode === mode.id && <div className="radio-dot" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizModeSelector;
