import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { quizAPI } from '../utils/api'
import { ArrowLeft, BookOpen, Users, TrendingUp, Award } from 'lucide-react'

export default function AnalyticsDashboard() {
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const data = await quizAPI.getAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Header */}
      <header className="bg-[#1a1f2e] border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">Analytics Dashboard</span>
          </div>

          <div className="w-32"></div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-6 w-6 text-cyan-400" />
              <span className="text-gray-400">Total Students</span>
            </div>
            <p className="text-4xl font-bold text-white">{analytics?.totalStudents || 0}</p>
          </div>

          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              <span className="text-gray-400">Total Attempts</span>
            </div>
            <p className="text-4xl font-bold text-white">{analytics?.totalAttempts || 0}</p>
          </div>

          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Award className="h-6 w-6 text-purple-400" />
              <span className="text-gray-400">Average Score</span>
            </div>
            <p className="text-4xl font-bold text-white">{analytics?.averageScore || 0}%</p>
          </div>
        </div>

        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Analytics Overview</h2>
          <p className="text-gray-400">Detailed analytics coming soon...</p>
        </div>
      </div>
    </div>
  )
}
