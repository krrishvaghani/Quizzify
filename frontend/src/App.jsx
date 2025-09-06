import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Landing from './pages/Landing'
import AIChatbot from './components/chat/AIChatbot'
import ChatProvider from './components/chat/ChatProvider'

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
    <Routes>
      {/* Landing page for unauthenticated users */}
      <Route path="/" element={authed ? <Navigate to="/app" replace /> : <Landing />} />
      
      {/* Authentication routes */}
      <Route path="/login" element={authed ? <Navigate to="/app" replace /> : <Login />} />
      <Route path="/signup" element={authed ? <Navigate to="/app" replace /> : <Register />} />
      
      {/* Protected app routes */}
      <Route path="/app/*" element={
        authed ? (
          <div className="app-container">
            <nav className="navbar">
              <div className="nav-brand">
                <Link to="/app" className="brand-link">
                  <div className="brand-icon">🎯</div>
                  <span className="brand-text">Quizzify</span>
                </Link>
              </div>
              <div className="nav-menu">
                <Link to="/app" className="nav-link">Quiz Generator</Link>
                <Link to="/app/dashboard" className="nav-link">Dashboard</Link>
                <button className="nav-button logout-btn" onClick={handleLogout}>
                  <span className="btn-icon">🚪</span>
                  Logout
                </button>
              </div>
            </nav>
            
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </main>
            
            <AIChatbot />
          </div>
        ) : (
          <Navigate to="/" replace />
        )
      } />
    </Routes>
  )
}

export default App
