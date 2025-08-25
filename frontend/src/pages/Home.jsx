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

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('file', file)
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:8001/api/quiz/generate?num_questions=${encodeURIComponent(num)}` , {
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

  return (
    <div className="container">
      <div className="card" style={{ margin: '20px auto' }}>
        <div className="title">Generate a quiz</div>
        <div className="subtitle">Upload a PDF/DOCX/TXT (large files supported).</div>

        <div
          className={`dropzone ${drag ? 'drag' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
        >
          {file ? (
            <div>Selected: <strong>{file.name}</strong></div>
          ) : (
            <div>Drag and drop a file here, or choose below</div>
          )}
        </div>

        <form onSubmit={handleUpload} className="grid" style={{ marginTop: 12 }}>
          <div className="row">
            <input className="input" type="number" min={1} max={100} value={num} onChange={(e) => setNum(e.target.valueAsNumber || 5)} placeholder="Number of questions" style={{ maxWidth: 200 }} />
          </div>
          <input className="file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button className="button" disabled={loading || !file}>{loading ? 'Generating...' : 'Generate Quiz'}</button>
          {error && <div style={{ color: '#ef4444' }}>{error}</div>}
        </form>
      </div>

      {questions.length > 0 && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="title">Questions</div>
          <ol>
            {questions.map((q, idx) => (
              <li key={idx} className="question">
                <div style={{ fontWeight: 600 }}>{q.question}</div>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {(q.options || []).map((o, i) => (
                    <li key={i}>
                      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input
                          type="radio"
                          name={`q-${idx}`}
                          checked={answers[idx] === i}
                          onChange={() => setAnswers((prev) => ({ ...prev, [idx]: i }))}
                        />
                        <span>{o}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                {showResults && (
                  <div className="explain">
                    <div>Correct answer: <strong>{(q.options || [])[q.answerIndex]}</strong></div>
                    {q.explanation && <div>{q.explanation}</div>}
                  </div>
                )}
              </li>
            ))}
          </ol>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="button" onClick={() => {
              let correct = 0
              questions.forEach((q, i) => { if (answers[i] === q.answerIndex) correct += 1 })
              setScore({ correct, total: questions.length })
              setShowResults(true)
            }}>Finish & Show Score</button>
          </div>
          {score && (
            <div className="subtitle" style={{ marginTop: 12 }}>
              Score: <strong>{score.correct}</strong> / {score.total}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Home


