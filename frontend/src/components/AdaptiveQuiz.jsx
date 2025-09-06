import React, { useState, useEffect } from 'react';
import { DifficultyManager, DIFFICULTY_LEVELS } from '../utils/difficultyManager';
import DifficultyIndicator from './DifficultyIndicator';
import DifficultyAdjustmentNotification from './DifficultyAdjustmentNotification';
import { Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

const AdaptiveQuiz = ({ questions, onComplete, timePerQuestion = 30 }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [difficultyManager] = useState(() => new DifficultyManager(DIFFICULTY_LEVELS.MEDIUM));
  const [difficultyAdjustment, setDifficultyAdjustment] = useState(null);
  const [quizResults, setQuizResults] = useState([]);

  const currentQuestion = questions[currentQuestionIndex];
  const difficultyInfo = difficultyManager.getCurrentDifficultyInfo();

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeUp();
    }
  }, [timeLeft, isAnswered]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(timePerQuestion);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowFeedback(false);
  }, [currentQuestionIndex, timePerQuestion]);

  const handleTimeUp = () => {
    setIsAnswered(true);
    setShowFeedback(true);
    
    // Process as incorrect answer
    const adjustment = difficultyManager.processAnswer(false, currentQuestion.id);
    setDifficultyAdjustment(adjustment);
    
    // Record result
    const result = {
      questionIndex: currentQuestionIndex,
      question: currentQuestion.question,
      selectedAnswer: null,
      correctAnswer: currentQuestion.options[currentQuestion.answerIndex],
      isCorrect: false,
      timeTaken: timePerQuestion,
      difficulty: difficultyInfo.level
    };
    
    setQuizResults(prev => [...prev, result]);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setShowFeedback(true);
    
    const isCorrect = answerIndex === currentQuestion.answerIndex;
    const adjustment = difficultyManager.processAnswer(isCorrect, currentQuestion.id);
    setDifficultyAdjustment(adjustment);
    
    // Record result
    const result = {
      questionIndex: currentQuestionIndex,
      question: currentQuestion.question,
      selectedAnswer: currentQuestion.options[answerIndex],
      correctAnswer: currentQuestion.options[currentQuestion.answerIndex],
      isCorrect,
      timeTaken: timePerQuestion - timeLeft,
      difficulty: difficultyInfo.level
    };
    
    setQuizResults(prev => [...prev, result]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setDifficultyAdjustment(null);
    } else {
      // Quiz complete
      const finalStats = difficultyManager.getStatistics();
      onComplete({
        results: quizResults,
        statistics: finalStats,
        difficultyManager: difficultyManager.toJSON()
      });
    }
  };

  const getAnswerClass = (answerIndex) => {
    if (!showFeedback) {
      return selectedAnswer === answerIndex ? 'selected' : '';
    }
    
    if (answerIndex === currentQuestion.answerIndex) {
      return 'correct';
    }
    
    if (selectedAnswer === answerIndex && answerIndex !== currentQuestion.answerIndex) {
      return 'incorrect';
    }
    
    return '';
  };

  const getTimeColor = () => {
    const percentage = (timeLeft / timePerQuestion) * 100;
    if (percentage > 50) return '#22c55e';
    if (percentage > 20) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="adaptive-quiz-container">
      {/* Difficulty Adjustment Notification */}
      {difficultyAdjustment && (
        <DifficultyAdjustmentNotification 
          adjustment={difficultyAdjustment}
          onClose={() => setDifficultyAdjustment(null)}
        />
      )}

      {/* Quiz Header */}
      <div className="quiz-header">
        <div className="quiz-progress-info">
          <h2 className="quiz-title">Adaptive Learning Quiz</h2>
          <div className="progress-indicator">
            <span className="progress-text">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="quiz-timer">
          <div className="timer-circle" style={{ borderColor: getTimeColor() }}>
            <Clock size={20} style={{ color: getTimeColor() }} />
            <span className="timer-text" style={{ color: getTimeColor() }}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* Difficulty Indicator */}
      <DifficultyIndicator difficultyInfo={difficultyInfo} compact={false} />

      {/* Question Card */}
      <div className="question-card adaptive">
        <div className="question-header">
          <span className="question-number">Question {currentQuestionIndex + 1}</span>
          <span className="difficulty-badge" style={{ 
            backgroundColor: difficultyInfo.config.bgColor,
            color: difficultyInfo.config.color 
          }}>
            {difficultyInfo.config.label}
          </span>
        </div>

        <h3 className="question-text">{currentQuestion.question}</h3>

        <div className="options-grid">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${getAnswerClass(index)}`}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
            >
              <div className="option-content">
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                {showFeedback && index === currentQuestion.answerIndex && (
                  <CheckCircle size={20} className="option-icon correct" />
                )}
                {showFeedback && selectedAnswer === index && index !== currentQuestion.answerIndex && (
                  <XCircle size={20} className="option-icon incorrect" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Feedback Section */}
        {showFeedback && (
          <div className="feedback-section">
            <div className={`feedback-message ${selectedAnswer === currentQuestion.answerIndex ? 'correct' : 'incorrect'}`}>
              {selectedAnswer === null ? (
                <div className="feedback-timeout">
                  <XCircle size={24} />
                  <div>
                    <h4>Time's Up!</h4>
                    <p>The correct answer was: {currentQuestion.options[currentQuestion.answerIndex]}</p>
                  </div>
                </div>
              ) : selectedAnswer === currentQuestion.answerIndex ? (
                <div className="feedback-correct">
                  <CheckCircle size={24} />
                  <div>
                    <h4>Correct!</h4>
                    <p>Well done! You got it right.</p>
                  </div>
                </div>
              ) : (
                <div className="feedback-incorrect">
                  <XCircle size={24} />
                  <div>
                    <h4>Not quite right</h4>
                    <p>The correct answer was: {currentQuestion.options[currentQuestion.answerIndex]}</p>
                  </div>
                </div>
              )}
            </div>

            {currentQuestion.explanation && (
              <div className="explanation-box">
                <h5>Explanation:</h5>
                <p>{currentQuestion.explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      {showFeedback && (
        <div className="quiz-navigation">
          <button 
            className="btn-primary next-question"
            onClick={handleNextQuestion}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default AdaptiveQuiz;
