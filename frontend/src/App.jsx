import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Home from './pages/Home.jsx'

const isAuthed = () => !!localStorage.getItem('token')

function App() {
  const [authed, setAuthed] = useState(isAuthed())

  useEffect(() => {
    const syncAuth = () => setAuthed(isAuthed())
    window.addEventListener('storage', syncAuth)
    return () => window.removeEventListener('storage', syncAuth)
  }, [])
  return (
    <div className="container">
      <nav className="nav" style={{ justifyContent: 'space-between' }}>
        <div className="row" style={{ gap: 16 }}>
          <Link to="/">Home</Link>
        </div>
        <div className="row" style={{ gap: 16 }}>
          {authed ? (
            <button className="button" onClick={() => { localStorage.removeItem('token'); window.dispatchEvent(new Event('storage')); }}>Logout</button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={authed ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={authed ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signup" element={authed ? <Navigate to="/" replace /> : <Signup />} />
      </Routes>
    </div>
  )
}

export default App
