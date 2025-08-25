import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const body = new URLSearchParams()
      body.append('username', email)
      body.append('password', password)
      const res = await fetch('http://localhost:8001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      })
      if (!res.ok) throw new Error('Login failed')
      const data = await res.json()
      localStorage.setItem('token', data.access_token)
      // notify app auth state listeners, then navigate
      window.dispatchEvent(new Event('storage'))
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
        <div className="title">Welcome back</div>
        <div className="subtitle">Sign in to continue generating quizzes.</div>
        <form onSubmit={handleSubmit} className="grid">
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="button" disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
          {error && <div style={{ color: '#ef4444' }}>{error}</div>}
        </form>
        <div className="subtitle" style={{ marginTop: 12 }}>Don't have an account? <Link to="/signup">Signup</Link></div>
      </div>
    </div>
  )
}

export default Login


