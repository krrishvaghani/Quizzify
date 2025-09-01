import { useCallback, useState } from 'react'

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
  const [currentStep, setCurrentStep] = useState('upload') // upload, quiz, results

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return
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
    setCurrentStep('upload')
    setError('')
  }

  const getFileIcon = (fileName) => {
    if (fileName?.endsWith('.pdf')) return '📄'
    if (fileName?.endsWith('.docx')) return '📝'
    if (fileName?.endsWith('.txt')) return '📄'
    return '📁'
  }

  if (currentStep === 'quiz') {
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

  if (currentStep === 'results') {
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

        {questions.map((q, idx) => (
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
        ))}

        <div className="results-actions">
          <button className="btn-secondary" onClick={resetQuiz}>
            <span className="btn-icon">🔄</span>
            Take Another Quiz
          </button>
          <a href="/dashboard" className="btn-primary">
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
                <span className="btn-icon">🚀</span>
                Generate Quiz
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


