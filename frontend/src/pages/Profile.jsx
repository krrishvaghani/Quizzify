import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI, quizAPI } from '../utils/api'
import { 
  User, 
  Mail, 
  Lock, 
  ArrowLeft, 
  Save, 
  Edit, 
  BookOpen, 
  CheckCircle, 
  Star, 
  TrendingUp,
  LogOut,
  Sparkles
} from 'lucide-react'

export default function Profile() {
  const navigate = useNavigate()
  const { user, setUser, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [analytics, setAnalytics] = useState(null)
  const [attempts, setAttempts] = useState([])
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: ''
  })
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        full_name: user.full_name || ''
      })
    }
    fetchAnalytics()
  }, [user])

  const fetchAnalytics = async () => {
    try {
      console.log('📊 Fetching profile analytics...');
      const data = await quizAPI.getMyAttempts()
      console.log('✅ Profile analytics data:', data);
      const allAttempts = data.attempts || []
      setAttempts(allAttempts)
      
      // Calculate analytics
      const totalAttempts = allAttempts.length
      const completionRate = totalAttempts > 0 ? 100 : 0
      const avgScore = totalAttempts > 0 
        ? allAttempts.reduce((sum, a) => sum + ((a.score / (a.max_score || a.total_questions)) * 100), 0) / totalAttempts 
        : 0
      
      setAnalytics({
        totalAttempts,
        completionRate,
        averageScore: avgScore.toFixed(1)
      })
    } catch (error) {
      console.error('❌ Error fetching analytics:', error)
      console.error('Error details:', error.response?.data || error.message);
    }
  }

  const getScoreHistory = () => {
    if (!attempts || attempts.length === 0) return []
    
    // Get all attempts with quiz names
    return attempts.map(attempt => ({
      quizName: attempt.quiz_title || 'Quiz',
      score: ((attempt.score / (attempt.max_score || attempt.total_questions)) * 100).toFixed(1),
      date: new Date(attempt.completed_at || attempt.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }))
  }

  const getLatestQuiz = () => {
    if (!attempts || attempts.length === 0) return null
    const latest = attempts[attempts.length - 1]
    return {
      title: latest.quiz_title || 'Quiz',
      score: ((latest.score / (latest.max_score || latest.total_questions)) * 100).toFixed(1),
      date: new Date(latest.completed_at || latest.created_at).toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSubmitProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const response = await authAPI.updateProfile(formData)
      setUser(response.user)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }
    try {
      await authAPI.updatePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      })
      setSuccess('Password changed successfully!')
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const scoreHistory = getScoreHistory()
  const latestQuiz = getLatestQuiz()

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Header */}
      <header className="bg-[#1a1f2e] border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">QUIZZIFY</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1f2e] rounded-2xl border border-gray-800 p-6">
              {/* Profile Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 transform hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-4xl">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {user?.username || 'User'}
                </h2>
                <p className="text-gray-400 text-sm mb-1">{user?.email}</p>
                <p className="text-gray-500 text-xs">
                  Joined {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
                
                <button
                  onClick={() => setShowEditProfile(!showEditProfile)}
                  className="mt-4 flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Edit className="h-4 w-4" />
                  <span className="font-medium">Edit Profile</span>
                </button>
              </div>

              {/* Stats Cards */}
              <div className="space-y-4">
                <div className="bg-[#1a1f2e] rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="h-5 w-5 text-cyan-400" />
                    <span className="text-gray-400 text-sm">Total Attempts</span>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {analytics?.totalAttempts || 0}
                  </p>
                </div>

                <div className="bg-[#1a1f2e] rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-gray-400 text-sm">Completion Rate</span>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {analytics?.completionRate || 0}%
                  </p>
                </div>

                <div className="bg-[#1a1f2e] rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="h-5 w-5 text-purple-400" />
                    <span className="text-gray-400 text-sm">Average Score</span>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {analytics?.averageScore || 0}%
                  </p>
                </div>
              </div>

              {/* Latest Quiz */}
              {latestQuiz && (
                <div className="mt-6 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Latest Quiz</h3>
                  <p className="text-gray-300 text-sm mb-2">{latestQuiz.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-cyan-400">{latestQuiz.score}%</span>
                    <span className="text-gray-400 text-xs">{latestQuiz.date}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Performance History & Edit Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance History Chart */}
            <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Performance History</h3>
                  <p className="text-gray-400 text-sm">Your quiz scores over time</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:opacity-90 text-white text-sm rounded-lg transition-opacity">
                  All Time
                </button>
              </div>

              {/* Chart */}
              {scoreHistory.length > 0 ? (
                <div className="relative" style={{ height: '360px', paddingBottom: '80px', paddingLeft: '60px', paddingRight: '20px' }}>
                  {/* Y-Axis Labels */}
                  <div className="absolute left-0 top-0 flex flex-col justify-between" style={{ height: '280px', width: '50px' }}>
                    {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].map((val, idx) => (
                      <div key={val} className="flex items-center justify-end pr-2">
                        <span className="text-xs text-gray-500 font-normal">{val}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Grid Lines */}
                  <div className="absolute flex flex-col justify-between" style={{ height: '280px', left: '60px', right: '20px', top: '0' }}>
                    {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].map((val) => (
                      <div key={val} className="border-t border-slate-700/40 w-full"></div>
                    ))}
                  </div>

                  {/* Chart Container */}
                  <div className="absolute" style={{ height: '280px', left: '60px', right: '20px', top: '0' }}>
                    {/* Line Chart with SVG */}
                    <svg className="w-full h-full" style={{ overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#06B6D4" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                      </defs>
                      
                      {/* Draw lines between points */}
                      {scoreHistory.map((point, idx) => {
                        if (idx === scoreHistory.length - 1) return null
                        
                        const totalPoints = scoreHistory.length
                        const x1 = totalPoints === 1 ? 50 : (idx / (totalPoints - 1)) * 100
                        const y1 = 100 - parseFloat(point.score)
                        const x2 = totalPoints === 1 ? 50 : ((idx + 1) / (totalPoints - 1)) * 100
                        const y2 = 100 - parseFloat(scoreHistory[idx + 1].score)
                        
                        return (
                          <line
                            key={`line-${idx}`}
                            x1={`${x1}%`}
                            y1={`${y1}%`}
                            x2={`${x2}%`}
                            y2={`${y2}%`}
                            stroke="#06B6D4"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        )
                      })}
                      
                      {/* Data Points - Circles */}
                      {scoreHistory.map((point, idx) => {
                        const totalPoints = scoreHistory.length
                        const x = totalPoints === 1 ? 50 : (idx / (totalPoints - 1)) * 100
                        const y = 100 - parseFloat(point.score)
                        
                        return (
                          <g key={`point-${idx}`}>
                            <circle
                              cx={`${x}%`}
                              cy={`${y}%`}
                              r="5"
                              fill="#06B6D4"
                              stroke="none"
                            />
                          </g>
                        )
                      })}
                    </svg>
                  </div>

                  {/* X-axis Labels - Quiz Names */}
                  <div 
                    className="absolute flex justify-between" 
                    style={{ 
                      bottom: '0px',
                      left: '60px',
                      right: '20px',
                      height: '60px'
                    }}
                  >
                    {scoreHistory.map((point, idx) => {
                      const totalPoints = scoreHistory.length
                      const position = totalPoints === 1 ? 50 : (idx / (totalPoints - 1)) * 100
                      return (
                        <div 
                          key={idx} 
                          className="absolute"
                          style={{ 
                            left: `${position}%`,
                            transform: 'translateX(-50%)',
                            bottom: '0'
                          }}
                        >
                          <div className="flex flex-col items-center">
                            <span 
                              className="text-gray-400 text-xs font-normal whitespace-nowrap"
                              style={{
                                transform: 'rotate(-45deg)',
                                transformOrigin: 'center center',
                                marginTop: '20px'
                              }}
                              title={point.quizName}
                            >
                              {point.quizName}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-600" />
                    <p>No quiz history yet</p>
                    <p className="text-sm">Take a quiz to see your performance</p>
                  </div>
                </div>
              )}
            </div>

            {/* Edit Profile Form */}
            {showEditProfile && (
              <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Edit Profile Information</h3>
                <form onSubmit={handleSubmitProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                    <input 
                      type="text" 
                      value={formData.username} 
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                      className="w-full px-4 py-2.5 bg-[#252b3b] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                      className="w-full px-4 py-2.5 bg-[#252b3b] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.full_name} 
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} 
                      className="w-full px-4 py-2.5 bg-[#252b3b] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all" 
                    />
                  </div>
                  <div className="flex gap-3">
                    <button 
                      type="submit" 
                      disabled={loading} 
                      className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:opacity-90 text-white py-2.5 px-4 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowEditProfile(false)}
                      className="px-6 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Change Password</h3>
                  <form onSubmit={handleSubmitPassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                      <input 
                        type="password" 
                        value={passwordData.current_password} 
                        onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })} 
                        className="w-full px-4 py-2.5 bg-[#252b3b] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                      <input 
                        type="password" 
                        value={passwordData.new_password} 
                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} 
                        className="w-full px-4 py-2.5 bg-[#252b3b] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={passwordData.confirm_password} 
                        onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })} 
                        className="w-full px-4 py-2.5 bg-[#252b3b] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all" 
                        required 
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading} 
                      className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:opacity-90 text-white py-2.5 px-4 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity"
                    >
                      <Lock className="h-4 w-4" />
                      Change Password
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Messages */}
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}