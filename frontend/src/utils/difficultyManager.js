// Difficulty levels and management system
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

export const DIFFICULTY_CONFIG = {
  [DIFFICULTY_LEVELS.EASY]: {
    label: 'Easy',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.1)',
    icon: '🟢',
    description: 'Basic concepts and straightforward questions'
  },
  [DIFFICULTY_LEVELS.MEDIUM]: {
    label: 'Medium',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    icon: '🟡',
    description: 'Moderate complexity with some analysis required'
  },
  [DIFFICULTY_LEVELS.HARD]: {
    label: 'Hard',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    icon: '🔴',
    description: 'Advanced concepts requiring deep understanding'
  }
};

export class DifficultyManager {
  constructor(initialDifficulty = DIFFICULTY_LEVELS.MEDIUM) {
    this.currentDifficulty = initialDifficulty;
    this.consecutiveCorrect = 0;
    this.consecutiveWrong = 0;
    this.difficultyHistory = [initialDifficulty];
    this.questionHistory = [];
    this.adjustmentRules = {
      correctThreshold: 3,  // Move up after 3 correct in a row
      wrongThreshold: 2     // Move down after 2 wrong in a row
    };
  }

  // Process answer and adjust difficulty
  processAnswer(isCorrect, questionId = null) {
    const previousDifficulty = this.currentDifficulty;
    
    // Record the answer
    this.questionHistory.push({
      questionId,
      isCorrect,
      difficulty: this.currentDifficulty,
      timestamp: new Date().toISOString()
    });

    if (isCorrect) {
      this.consecutiveCorrect++;
      this.consecutiveWrong = 0;
      
      // Check if we should increase difficulty
      if (this.consecutiveCorrect >= this.adjustmentRules.correctThreshold) {
        this.increaseDifficulty();
        this.consecutiveCorrect = 0;
      }
    } else {
      this.consecutiveWrong++;
      this.consecutiveCorrect = 0;
      
      // Check if we should decrease difficulty
      if (this.consecutiveWrong >= this.adjustmentRules.wrongThreshold) {
        this.decreaseDifficulty();
        this.consecutiveWrong = 0;
      }
    }

    const adjustment = {
      previousDifficulty,
      newDifficulty: this.currentDifficulty,
      wasAdjusted: previousDifficulty !== this.currentDifficulty,
      consecutiveCorrect: this.consecutiveCorrect,
      consecutiveWrong: this.consecutiveWrong,
      reason: this.getAdjustmentReason(isCorrect, previousDifficulty)
    };

    return adjustment;
  }

  increaseDifficulty() {
    const levels = Object.values(DIFFICULTY_LEVELS);
    const currentIndex = levels.indexOf(this.currentDifficulty);
    
    if (currentIndex < levels.length - 1) {
      this.currentDifficulty = levels[currentIndex + 1];
      this.difficultyHistory.push(this.currentDifficulty);
    }
  }

  decreaseDifficulty() {
    const levels = Object.values(DIFFICULTY_LEVELS);
    const currentIndex = levels.indexOf(this.currentDifficulty);
    
    if (currentIndex > 0) {
      this.currentDifficulty = levels[currentIndex - 1];
      this.difficultyHistory.push(this.currentDifficulty);
    }
  }

  getAdjustmentReason(isCorrect, previousDifficulty) {
    if (previousDifficulty === this.currentDifficulty) {
      return null;
    }
    
    if (isCorrect && this.currentDifficulty !== previousDifficulty) {
      return `Great job! ${this.adjustmentRules.correctThreshold} correct answers in a row - moving to ${DIFFICULTY_CONFIG[this.currentDifficulty].label}`;
    }
    
    if (!isCorrect && this.currentDifficulty !== previousDifficulty) {
      return `Don't worry! Let's try some ${DIFFICULTY_CONFIG[this.currentDifficulty].label} questions to build confidence`;
    }
    
    return null;
  }

  // Get current difficulty info
  getCurrentDifficultyInfo() {
    return {
      level: this.currentDifficulty,
      config: DIFFICULTY_CONFIG[this.currentDifficulty],
      consecutiveCorrect: this.consecutiveCorrect,
      consecutiveWrong: this.consecutiveWrong,
      progressToNext: this.getProgressToNext()
    };
  }

  getProgressToNext() {
    const levels = Object.values(DIFFICULTY_LEVELS);
    const currentIndex = levels.indexOf(this.currentDifficulty);
    
    // If at highest level, show maintenance progress
    if (currentIndex === levels.length - 1) {
      return {
        type: 'maintain',
        current: this.consecutiveCorrect,
        target: this.adjustmentRules.correctThreshold,
        message: 'Keep up the excellent work!'
      };
    }
    
    // If at lowest level, show recovery progress
    if (currentIndex === 0) {
      const wrongsUntilDown = Math.max(0, this.adjustmentRules.wrongThreshold - this.consecutiveWrong);
      return {
        type: 'recover',
        current: this.consecutiveCorrect,
        target: this.adjustmentRules.correctThreshold,
        message: `${this.adjustmentRules.correctThreshold - this.consecutiveCorrect} more correct to advance`
      };
    }
    
    // Normal progression
    return {
      type: 'advance',
      current: this.consecutiveCorrect,
      target: this.adjustmentRules.correctThreshold,
      message: `${this.adjustmentRules.correctThreshold - this.consecutiveCorrect} more correct to advance to ${DIFFICULTY_CONFIG[levels[currentIndex + 1]].label}`
    };
  }

  // Get statistics
  getStatistics() {
    const totalQuestions = this.questionHistory.length;
    const correctAnswers = this.questionHistory.filter(q => q.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    // Count questions by difficulty
    const difficultyBreakdown = {};
    Object.values(DIFFICULTY_LEVELS).forEach(level => {
      difficultyBreakdown[level] = {
        total: this.questionHistory.filter(q => q.difficulty === level).length,
        correct: this.questionHistory.filter(q => q.difficulty === level && q.isCorrect).length
      };
    });

    return {
      totalQuestions,
      correctAnswers,
      accuracy: Math.round(accuracy * 100) / 100,
      difficultyBreakdown,
      currentStreak: this.consecutiveCorrect,
      difficultyChanges: this.difficultyHistory.length - 1
    };
  }

  // Serialize for storage
  toJSON() {
    return {
      currentDifficulty: this.currentDifficulty,
      consecutiveCorrect: this.consecutiveCorrect,
      consecutiveWrong: this.consecutiveWrong,
      difficultyHistory: this.difficultyHistory,
      questionHistory: this.questionHistory,
      adjustmentRules: this.adjustmentRules
    };
  }

  // Deserialize from storage
  static fromJSON(data) {
    const manager = new DifficultyManager();
    Object.assign(manager, data);
    return manager;
  }
}
