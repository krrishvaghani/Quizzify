import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../utils/api'
import { BookOpen, User, Lock, Eye, EyeOff, Sun, Moon, ArrowLeft } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await authAPI.login({ email, password })
      login(data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1e293b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-32 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Theme toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        {isDark ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
      </button>

      {/* Main Card */}
      <div className="w-full max-w-md bg-[#0f1419] border border-gray-800 rounded-3xl shadow-2xl p-8 relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">QUIZZIFY</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to continue your learning journey</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-gray-100 border-0 rounded-xl text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                required
                className="w-full pl-12 pr-12 py-3.5 bg-gray-100 border-0 rounded-xl text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-cyan-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button type="button" className="text-sm text-gray-400 hover:text-white transition-colors">
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#0f1419] text-gray-500">or</span>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-white font-semibold hover:text-cyan-400 transition-colors">
              Create Account
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <button
          onClick={() => navigate('/')}
          className="w-full mt-6 flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Home</span>
        </button>
      </div>
    </div>
  )
}
