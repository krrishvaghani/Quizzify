import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, TrendingUp, TrendingDown, X } from 'lucide-react';
import { DIFFICULTY_CONFIG } from '../utils/difficultyManager';

const DifficultyAdjustmentNotification = ({ adjustment, onClose, autoClose = true }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose && adjustment.wasAdjusted) {
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [adjustment, autoClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose && onClose();
    }, 300);
  };

  if (!adjustment.wasAdjusted || !isVisible) {
    return null;
  }

  const isUpgrade = DIFFICULTY_CONFIG[adjustment.newDifficulty].label > DIFFICULTY_CONFIG[adjustment.previousDifficulty].label;
  const newConfig = DIFFICULTY_CONFIG[adjustment.newDifficulty];
  const previousConfig = DIFFICULTY_CONFIG[adjustment.previousDifficulty];

  return (
    <div className={`difficulty-notification ${isVisible ? 'visible' : 'hidden'}`}>
      <div 
        className="notification-content"
        style={{ 
          borderLeft: `4px solid ${newConfig.color}`,
          backgroundColor: newConfig.bgColor
        }}
      >
        <div className="notification-header">
          <div className="notification-icon" style={{ color: newConfig.color }}>
            {isUpgrade ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
          </div>
          <div className="notification-text">
            <h4 className="notification-title">
              {isUpgrade ? 'Level Up!' : 'Adjusting Difficulty'}
            </h4>
            <p className="notification-message">{adjustment.reason}</p>
          </div>
          <button className="notification-close" onClick={handleClose}>
            <X size={16} />
          </button>
        </div>
        
        <div className="difficulty-transition">
          <div className="difficulty-from">
            <span className="difficulty-label">{previousConfig.label}</span>
          </div>
          <div className="transition-arrow">→</div>
          <div className="difficulty-to" style={{ color: newConfig.color }}>
            <span className="difficulty-label">{newConfig.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DifficultyAdjustmentNotification;
