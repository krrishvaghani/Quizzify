import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'

const isAuthed = () => !!localStorage.getItem('token')

function App() {
  const [authed, setAuthed] = useState(isAuthed())

  useEffect(() => {
    const syncAuth = () => setAuthed(isAuthed())
    window.addEventListener('storage', syncAuth)
    return () => window.removeEventListener('storage', syncAuth)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.dispatchEvent(new Event('storage'))
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <div className="brand-icon">🎯</div>
            <span className="brand-text">Quizzify</span>
          </Link>
        </div>
        <div className="nav-menu">
          {authed ? (
            <>
              <Link to="/" className="nav-link">Quiz Generator</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <button className="nav-button logout-btn" onClick={handleLogout}>
                <span className="btn-icon">🚪</span>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link signup-link">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={authed ? <Home /> : <Navigate to="/login" replace />} />
          <Route path="/dashboard" element={authed ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={authed ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/signup" element={authed ? <Navigate to="/" replace /> : <Signup />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
