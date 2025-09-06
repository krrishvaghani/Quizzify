import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TopicSelector from '../components/TopicSelector';
import DifficultySelector from '../components/DifficultySelector';
import EnhancedQuiz from '../components/EnhancedQuiz';
import AdaptiveQuiz from '../components/AdaptiveQuiz';
import QuizModeSelector from '../components/QuizModeSelector';
import QuizSettings from '../components/QuizSettings';
import ProfessionalHeader from '../components/ProfessionalHeader';
import ProgressTracker from '../components/ProgressTracker';
import DifficultyStatistics from '../components/DifficultyStatistics';
import PersonalizedRecommendations from '../components/PersonalizedRecommendations';

function Home() {
  const [file, setFile] = useState(null)
  const [questions, setQuestions] = useState([])
  const [num, setNum] = useState(5)
  const [answers, setAnswers] = useState({})
  const [score, setScore] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [drag, setDrag] = useState(false)
  const [currentStep, setCurrentStep] = useState('upload') // upload, config, quiz, results, recommendations
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [lastQuizResults, setLastQuizResults] = useState(null)
  
  // New enhanced features
  const [selectedTopic, setSelectedTopic] = useState('general')
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy')
  const [availableTopics, setAvailableTopics] = useState([])
  const [timePerQuestion, setTimePerQuestion] = useState(30)
  const [totalTimeLimit, setTotalTimeLimit] = useState(null)
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState(true)
  const [recommendedDifficulty, setRecommendedDifficulty] = useState(null)
  const [quizMode, setQuizMode] = useState('document') // document or topic-based
  const [quizSettings, setQuizSettings] = useState({
    numQuestions: 10,
    timeLimit: 15,
    difficulty: 'medium',
    adaptiveDifficulty: true
  })

  useEffect(() => {
    fetchAvailableTopics()
    fetchRecommendedDifficulty()
  }, [])

  const fetchAvailableTopics = async () => {
    try {
      const response = await fetch('/api/quiz/topics')
      const topics = await response.json()
      setAvailableTopics(topics)
    } catch (error) {
      console.error('Failed to fetch topics:', error)
      setAvailableTopics(['math', 'science', 'history', 'literature', 'geography', 'technology', 'general'])
    }
  }

  const fetchRecommendedDifficulty = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'demo-user'
      const response = await fetch(`/api/quiz/user/${userId}/suggested-difficulty?topic=${selectedTopic}`)
      const data = await response.json()
      setRecommendedDifficulty(data.suggested_difficulty)
    } catch (error) {
      console.error('Failed to fetch recommended difficulty:', error)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return
    setCurrentStep('config')
  }

  const handleStartQuiz = () => {
    if (quizMode === 'document') {
      generateDocumentQuiz()
    } else {
      setCurrentStep('quiz')
    }
  }

  const generateDocumentQuiz = async () => {
    setLoading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('file', file)
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:8001/api/quiz/generate?num_questions=${encodeURIComponent(num)}`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: form,
      })
      if (!res.ok) throw new Error('Failed to generate quiz')
      const data = await res.json()
      setQuestions(data)
      setAnswers({})
      setScore(null)
      setShowResults(false)
      setCurrentStep('quiz')
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const getQuizConfig = () => {
    return {
      topic: selectedTopic,
      difficulty: selectedDifficulty,
      num_questions: num,
      time_per_question: timePerQuestion,
      total_time_limit: totalTimeLimit,
      adaptive_difficulty: adaptiveDifficulty
    }
  }

  const handleQuizComplete = (result) => {
    if (result.results) {
      // Adaptive quiz results
      const correctAnswers = result.results.filter(r => r.isCorrect).length
      setScore({ correct: correctAnswers, total: result.results.length })
      
      // Save adaptive quiz results to localStorage
      const quizResult = {
        title: `Adaptive Quiz - ${selectedTopic || file?.name || 'Document'}`,
        date: new Date().toISOString(),
        score: correctAnswers,
        totalQuestions: result.results.length,
        adaptiveStats: result.statistics,
        difficultyManager: result.difficultyManager,
        results: result.results
      }
      
      const existingHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]')
      existingHistory.unshift(quizResult)
      localStorage.setItem('quizHistory', JSON.stringify(existingHistory))
      
      // Store results for recommendations
      setLastQuizResults(result)
    } else {
      // Regular quiz results
      setScore({ correct: result.correct_answers, total: result.total_questions })
    }
    setCurrentStep('results')
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDrag(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFinishQuiz = () => {
    let correct = 0
    const incorrectAnswers = []
    
    questions.forEach((q, i) => {
      if (answers[i] === q.answerIndex) {
        correct += 1
      } else if (answers[i] !== undefined) {
        incorrectAnswers.push({
          question: q.question,
          yourAnswer: q.options[answers[i]],
          correctAnswer: q.options[q.answerIndex]
        })
      }
    })
    
    const quizResult = {
      title: `Quiz from ${file?.name || 'Document'}`,
      date: new Date().toISOString(),
      score: correct,
      totalQuestions: questions.length,
      incorrectAnswers
    }
    
    // Save to localStorage for dashboard
    const existingHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]')
    existingHistory.unshift(quizResult)
    localStorage.setItem('quizHistory', JSON.stringify(existingHistory))
    
    setScore({ correct, total: questions.length })
    setShowResults(true)
    setCurrentStep('results')
  }

  const resetQuiz = () => {
    setFile(null)
    setQuestions([])
    setAnswers({})
    setScore(null)
    setShowResults(false)
    setShowRecommendations(false)
    setLastQuizResults(null)
    setCurrentStep('upload')
    setError('')
  }

  const handleShowRecommendations = () => {
    setShowRecommendations(true)
    setCurrentStep('recommendations')
  }

  const handleGeneratePracticeQuiz = (topic) => {
    // Navigate back to quiz creation with focus on the weak topic
    setSelectedTopic(topic.toLowerCase())
    setQuizMode('topic')
    setShowRecommendations(false)
    setCurrentStep('config')
  }

  const handleCloseRecommendations = () => {
    setShowRecommendations(false)
    setCurrentStep('results')
  }

  const getFileIcon = (fileName) => {
    if (fileName?.endsWith('.pdf')) return '📄'
    if (fileName?.endsWith('.docx')) return '📝'
    if (fileName?.endsWith('.txt')) return '📄'
    return '📁'
  }

  if (currentStep === 'config') {
    return (
      <div className="professional-quiz-container">
        <ProfessionalHeader 
          title="Create Your Quiz"
          subtitle="Choose your preferred quiz mode and customize settings"
        />

        <div className="quiz-config-content">
          <ProgressTracker userStats={{
            totalQuizzes: 12,
            averageScore: 85,
            timeSpent: 240,
            streak: 5,
            improvement: 15
          }} />

          <QuizModeSelector 
            selectedMode={quizMode}
            onModeChange={setQuizMode}
          />

          <div className="enhanced-quiz-settings">
            <div className="settings-card">
              <h3>📝 Quiz Configuration</h3>
              <div className="settings-row">
                <div className="setting-group">
                  <label className="setting-label">Questions</label>
                  <input 
                    type="number" 
                    min={5} 
                    max={20} 
                    value={num} 
                    onChange={(e) => setNum(e.target.valueAsNumber || 10)}
                    className="setting-input-modern"
                  />
                </div>
                <div className="setting-group">
                  <label className="setting-label">Time per Question</label>
                  <select 
                    value={timePerQuestion} 
                    onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                    className="setting-select-modern"
                  >
                    <option value={15}>15 seconds</option>
                    <option value={30}>30 seconds</option>
                    <option value={60}>1 minute</option>
                    <option value={120}>2 minutes</option>
                  </select>
                </div>
              </div>
              <div className="adaptive-info">
                <div className="info-badge">
                  🧠 <strong>Adaptive Learning Enabled</strong>
                  <span>Difficulty adjusts based on your performance</span>
                </div>
              </div>
            </div>
          </div>

          {quizMode === 'topic' && (
            <>
              <TopicSelector 
                selectedTopic={selectedTopic}
                onTopicChange={setSelectedTopic}
                availableTopics={availableTopics}
              />
              
              <DifficultySelector 
                selectedDifficulty={selectedDifficulty}
                onDifficultyChange={setSelectedDifficulty}
                userRecommendation={recommendedDifficulty}
              />
            </>
          )}

        </div>

        <div className="config-actions">
          <button className="btn-secondary" onClick={() => setCurrentStep('upload')}>
            ← Back
          </button>
          <button className="btn-primary" onClick={handleStartQuiz}>
            Start Quiz →
          </button>
        </div>
      </div>
    )
  }

  if (currentStep === 'quiz') {
    if (quizMode === 'topic') {
      return (
        <EnhancedQuiz 
          quizConfig={getQuizConfig()}
          onComplete={handleQuizComplete}
        />
      )
    }
    
    // Document-based quiz with adaptive difficulty support
    if (adaptiveDifficulty && questions.length > 0) {
      return (
        <AdaptiveQuiz 
          questions={questions}
          onComplete={handleQuizComplete}
          timePerQuestion={timePerQuestion}
        />
      )
    }
    
    // Legacy document-based quiz
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h1 className="quiz-title">Quiz Time!</h1>
          <p className="quiz-subtitle">Answer {questions.length} questions based on your document</p>
          <div className="quiz-progress">
            <span className="progress-text">
              {Object.keys(answers).length} of {questions.length} answered
            </span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="questions-container">
          {questions.map((q, idx) => (
            <div key={idx} className="question-card">
              <div className="question-header">
                <span className="question-number">Question {idx + 1}</span>
                {answers[idx] !== undefined && (
                  <span className="answered-badge">✓ Answered</span>
                )}
              </div>
              
              <h3 className="question-text">{q.question}</h3>
              
              <div className="options-grid">
                {(q.options || []).map((option, i) => (
                  <label key={i} className={`option-item ${answers[idx] === i ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name={`q-${idx}`}
                      checked={answers[idx] === i}
                      onChange={() => setAnswers((prev) => ({ ...prev, [idx]: i }))}
                      className="option-input"
                    />
                    <span className="option-text">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="quiz-actions">
          <button className="btn-secondary" onClick={resetQuiz}>
            <span className="btn-icon">🔄</span>
            Start Over
          </button>
          <button 
            className="btn-primary" 
            onClick={handleFinishQuiz}
            disabled={Object.keys(answers).length < questions.length}
          >
            <span className="btn-icon">✅</span>
            Finish Quiz
          </button>
        </div>
      </div>
    )
  }

  if (currentStep === 'recommendations') {
    return (
      <PersonalizedRecommendations 
        quizResults={lastQuizResults}
        onGeneratePractice={handleGeneratePracticeQuiz}
        onClose={handleCloseRecommendations}
      />
    )
  }

  if (currentStep === 'results') {
    // Check if this was an adaptive quiz
    const latestQuizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]')[0]
    const isAdaptiveQuiz = latestQuizHistory?.adaptiveStats && latestQuizHistory?.difficultyManager
    
    return (
      <div className="results-container">
        <div className="results-header">
          <h1 className="results-title">Quiz Results</h1>
          <div className="score-display">
            <div className="score-circle">
              <span className="score-number">{score.correct}</span>
              <span className="score-total">/{score.total}</span>
            </div>
            <div className="score-percentage">
              {Math.round((score.correct / score.total) * 100)}%
            </div>
          </div>
          
          <div className="score-message">
            {score.correct === score.total ? (
              <span className="perfect-score">🎉 Perfect! Excellent work!</span>
            ) : score.correct >= score.total * 0.8 ? (
              <span className="good-score">👍 Great job! Well done!</span>
            ) : score.correct >= score.total * 0.6 ? (
              <span className="decent-score">💪 Good effort! Keep practicing!</span>
            ) : (
              <span className="improve-score">📚 Keep studying! You'll get better!</span>
            )}
          </div>
        </div>

        {/* Adaptive Learning Statistics */}
        {isAdaptiveQuiz && (
          <DifficultyStatistics 
            statistics={latestQuizHistory.adaptiveStats}
            showTitle={true}
          />
        )}

{/* Question Results - Show adaptive results if available, otherwise show legacy results */}
        {isAdaptiveQuiz && latestQuizHistory?.results ? (
          latestQuizHistory.results.map((result, idx) => (
            <div key={idx} className={`result-question ${result.isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="result-question-header">
                <span className="question-number">Q{idx + 1}</span>
                <span className={`result-status ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                  {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
                <span className="difficulty-badge" style={{ 
                  backgroundColor: result.difficulty === 'Easy' ? '#22c55e' : 
                                   result.difficulty === 'Medium' ? '#f59e0b' : '#ef4444',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.8rem'
                }}>
                  {result.difficulty}
                </span>
              </div>
              
              <h3 className="question-text">{result.question}</h3>
              
              <div className="answer-details">
                <div className="your-answer">
                  <strong>Your answer:</strong> {result.selectedAnswer || 'Not answered (Time up)'}
                </div>
                <div className="correct-answer">
                  <strong>Correct answer:</strong> {result.correctAnswer}
                </div>
                <div className="time-taken">
                  <strong>Time taken:</strong> {result.timeTaken}s
                </div>
              </div>
            </div>
          ))
        ) : (
          questions.map((q, idx) => (
            <div key={idx} className={`result-question ${answers[idx] === q.answerIndex ? 'correct' : 'incorrect'}`}>
              <div className="result-question-header">
                <span className="question-number">Q{idx + 1}</span>
                <span className={`result-status ${answers[idx] === q.answerIndex ? 'correct' : 'incorrect'}`}>
                  {answers[idx] === q.answerIndex ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
              
              <h3 className="question-text">{q.question}</h3>
              
              <div className="answer-details">
                <div className="your-answer">
                  <strong>Your answer:</strong> {answers[idx] !== undefined ? q.options[answers[idx]] : 'Not answered'}
                </div>
                <div className="correct-answer">
                  <strong>Correct answer:</strong> {q.options[q.answerIndex]}
                </div>
                {q.explanation && (
                  <div className="explanation">
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        <div className="results-actions">
          <button className="btn-secondary" onClick={resetQuiz}>
            <span className="btn-icon">🔄</span>
            Take Another Quiz
          </button>
          {isAdaptiveQuiz && (
            <button className="btn-adaptive" onClick={handleShowRecommendations}>
              <span className="btn-icon">🧠</span>
              Get AI Recommendations
            </button>
          )}
          <a href="/app/dashboard" className="btn-primary">
            <span className="btn-icon">📊</span>
            View Dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Transform Your Learning</h1>
        <p className="hero-subtitle">
          Upload any document and instantly generate personalized quizzes to test your knowledge
        </p>
      </div>

      <div className="upload-card">
        <div className="upload-header">
          <h2 className="upload-title">Create Your Quiz</h2>
          <p className="upload-subtitle">
            Support for PDF, DOCX, and TXT files. AI-powered question generation.
          </p>
        </div>

        <div
          className={`dropzone ${drag ? 'drag' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
        >
          {file ? (
            <div className="file-selected">
              <div className="file-icon">{getFileIcon(file.name)}</div>
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                <div className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
              <button className="remove-file" onClick={() => setFile(null)}>✕</button>
            </div>
          ) : (
            <div className="dropzone-content">
              <div className="dropzone-icon">📁</div>
              <h3>Drag & Drop your file here</h3>
              <p>or click to browse</p>
              <input 
                type="file" 
                className="file-input" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".pdf,.docx,.txt"
              />
            </div>
          )}
        </div>

        <form onSubmit={handleUpload} className="upload-form">
          <div className="form-row">
            <label className="form-label">
              Number of Questions
              <input 
                className="form-input" 
                type="number" 
                min={1} 
                max={20} 
                value={num} 
                onChange={(e) => setNum(e.target.valueAsNumber || 5)} 
                placeholder="5"
              />
            </label>
          </div>
          
          <button className="btn-primary upload-btn" disabled={loading || !file}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Generating Quiz...
              </>
            ) : (
              <>
                <span className="btn-icon">⚙️</span>
                Configure Quiz
              </>
            )}
          </button>
          
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>

      <div className="features-section">
        <h2 className="features-title">Why Choose Quizzify?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered</h3>
            <p>Advanced AI generates relevant questions from your content</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Monitor your learning journey with detailed analytics</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Results</h3>
            <p>Get your quiz results immediately with explanations</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home


