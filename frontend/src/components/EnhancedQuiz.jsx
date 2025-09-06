import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import QuizTimer from './QuizTimer'
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react'

const EnhancedQuiz = ({ quizConfig, onComplete }) => {
  const [session, setSession] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [showResult, setShowResult] = useState(false)
  const [lastResult, setLastResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    initializeQuiz()
  }, [quizConfig])

  const initializeQuiz = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/quiz/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...quizConfig,
          user_id: localStorage.getItem('userId') || 'demo-user'
        })
      })
      
      const sessionData = await response.json()
      setSession(sessionData)
      setCurrentQuestion(sessionData.questions[0])
      setQuestionStartTime(Date.now())
    } catch (error) {
      console.error('Failed to initialize quiz:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !session || !currentQuestion) return

    const timeTaken = (Date.now() - questionStartTime) / 1000

    try {
      const response = await fetch(`/api/quiz/session/${session.id}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question_id: currentQuestion.id,
          answer: selectedAnswer,
          time_taken: timeTaken
        })
      })

      const result = await response.json()
      setLastResult(result)
      setShowResult(true)

      // Auto-advance after showing result
      setTimeout(() => {
        if (result.is_last_question) {
          completeQuiz()
        } else {
          moveToNextQuestion(result.next_question_index)
        }
      }, 2000)

    } catch (error) {
      console.error('Failed to submit answer:', error)
    }
  }

  const moveToNextQuestion = (nextIndex) => {
    setCurrentQuestion(session.questions[nextIndex])
    setSelectedAnswer('')
    setShowResult(false)
    setLastResult(null)
    setQuestionStartTime(Date.now())
  }

  const completeQuiz = async () => {
    try {
      const response = await fetch(`/api/quiz/session/${session.id}/complete`, {
        method: 'POST'
      })
      
      const result = await response.json()
      setQuizCompleted(true)
      onComplete?.(result)
    } catch (error) {
      console.error('Failed to complete quiz:', error)
    }
  }

  const handleTimeUp = () => {
    if (!showResult && !quizCompleted) {
      handleSubmitAnswer()
    }
  }

  const restartQuiz = () => {
    setSession(null)
    setCurrentQuestion(null)
    setSelectedAnswer('')
    setShowResult(false)
    setLastResult(null)
    setQuizCompleted(false)
    initializeQuiz()
  }

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="loading-spinner"></div>
        <p>Preparing your quiz...</p>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="quiz-completed">
        <div className="completion-icon">
          <CheckCircle size={64} color="#10b981" />
        </div>
        <h2>Quiz Completed!</h2>
        <p>Great job! Check your dashboard for detailed results and AI feedback.</p>
        <div className="completion-actions">
          <button className="action-button primary" onClick={() => navigate('/dashboard')}>
            View Results
          </button>
          <button className="action-button secondary" onClick={restartQuiz}>
            <RotateCcw size={16} />
            Take Another Quiz
          </button>
        </div>
      </div>
    )
  }

  if (!session || !currentQuestion) {
    return (
      <div className="quiz-error">
        <p>Unable to load quiz. Please try again.</p>
        <button onClick={initializeQuiz}>Retry</button>
      </div>
    )
  }

  const progress = ((session.current_question_index) / session.questions.length) * 100

  return (
    <div className="enhanced-quiz">
      <div className="quiz-header">
        <div className="quiz-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">
            Question {session.current_question_index + 1} of {session.questions.length}
          </span>
        </div>
        
        <QuizTimer
          timeLimit={currentQuestion.time_limit}
          onTimeUp={handleTimeUp}
          isActive={!showResult && !quizCompleted}
          key={currentQuestion.id}
        />
      </div>

      <div className="quiz-content">
        <div className="question-section">
          <div className="question-header">
            <span className="question-topic">{quizConfig.topic}</span>
            <span className="question-difficulty">{quizConfig.difficulty}</span>
          </div>
          
          <h2 className="question-text">{currentQuestion.question}</h2>
          
          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${selectedAnswer === option ? 'selected' : ''} ${
                  showResult ? (
                    option === currentQuestion.correct_answer ? 'correct' : 
                    option === selectedAnswer ? 'incorrect' : ''
                  ) : ''
                }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                {showResult && option === currentQuestion.correct_answer && (
                  <CheckCircle size={20} className="result-icon" />
                )}
                {showResult && option === selectedAnswer && option !== currentQuestion.correct_answer && (
                  <XCircle size={20} className="result-icon" />
                )}
              </button>
            ))}
          </div>

          {showResult && currentQuestion.explanation && (
            <div className="explanation-section">
              <h4>Explanation:</h4>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        <div className="quiz-actions">
          {!showResult ? (
            <button
              className="submit-button"
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
            >
              Submit Answer
              <ArrowRight size={16} />
            </button>
          ) : (
            <div className="result-feedback">
              {lastResult?.is_correct ? (
                <div className="feedback correct">
                  <CheckCircle size={24} />
                  <span>Correct!</span>
                </div>
              ) : (
                <div className="feedback incorrect">
                  <XCircle size={24} />
                  <span>Incorrect</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EnhancedQuiz
