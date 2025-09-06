import React from 'react';
import { Clock, Hash, Target, Zap } from 'lucide-react';

const QuizSettings = ({ settings, onSettingsChange }) => {
  const handleSliderChange = (key, value) => {
    onSettingsChange({ ...settings, [key]: parseInt(value) });
  };

  const handleToggleChange = (key) => {
    onSettingsChange({ ...settings, [key]: !settings[key] });
  };

  const handleSelectChange = (key, value) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="quiz-settings-section">
      <h2 className="section-title">Quiz Settings</h2>
      <div className="settings-grid">
        
        {/* Number of Questions */}
        <div className="setting-item">
          <div className="setting-header">
            <Hash className="setting-icon" size={20} />
            <label className="setting-label">Number of Questions</label>
            <span className="setting-value">{settings.numQuestions}</span>
          </div>
          <div className="slider-container">
            <input
              type="range"
              min="5"
              max="20"
              value={settings.numQuestions}
              onChange={(e) => handleSliderChange('numQuestions', e.target.value)}
              className="custom-slider"
            />
            <div className="slider-labels">
              <span>5</span>
              <span>20</span>
            </div>
          </div>
        </div>

        {/* Time Limit */}
        <div className="setting-item">
          <div className="setting-header">
            <Clock className="setting-icon" size={20} />
            <label className="setting-label">Time Limit (minutes)</label>
            <span className="setting-value">{settings.timeLimit}</span>
          </div>
          <div className="slider-container">
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={settings.timeLimit}
              onChange={(e) => handleSliderChange('timeLimit', e.target.value)}
              className="custom-slider"
            />
            <div className="slider-labels">
              <span>5 min</span>
              <span>60 min</span>
            </div>
          </div>
        </div>

        {/* Difficulty Level */}
        <div className="setting-item">
          <div className="setting-header">
            <Target className="setting-icon" size={20} />
            <label className="setting-label">Difficulty Level</label>
          </div>
          <div className="dropdown-container">
            <select
              value={settings.difficulty}
              onChange={(e) => handleSelectChange('difficulty', e.target.value)}
              className="custom-dropdown"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Adaptive Difficulty Toggle */}
        <div className="setting-item">
          <div className="setting-header">
            <Zap className="setting-icon" size={20} />
            <label className="setting-label">Adaptive Difficulty</label>
          </div>
          <div className="toggle-container">
            <div 
              className={`toggle-switch ${settings.adaptiveDifficulty ? 'active' : ''}`}
              onClick={() => handleToggleChange('adaptiveDifficulty')}
            >
              <div className="toggle-slider">
                <div className="toggle-knob"></div>
              </div>
            </div>
            <span className="toggle-text">
              {settings.adaptiveDifficulty ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuizSettings;
