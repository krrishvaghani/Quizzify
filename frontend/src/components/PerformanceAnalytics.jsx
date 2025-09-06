import { useState, useEffect } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import { TrendingUp, Target, Clock, Award } from 'lucide-react'

const PerformanceAnalytics = ({ userId }) => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchAnalytics()
  }, [userId])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/quiz/user/${userId}/performance`)
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading your performance analytics...</p>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="analytics-error">
        <p>Unable to load analytics data</p>
      </div>
    )
  }

  const topicAccuracyData = Object.entries(analytics.accuracy_by_topic).map(([topic, accuracy]) => ({
    topic: topic.charAt(0).toUpperCase() + topic.slice(1),
    accuracy: accuracy.toFixed(1)
  }))

  const difficultyData = Object.entries(analytics.accuracy_by_difficulty).map(([difficulty, accuracy]) => ({
    difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
    accuracy: accuracy.toFixed(1)
  }))

  const timeData = Object.entries(analytics.average_time_by_topic).map(([topic, time]) => ({
    topic: topic.charAt(0).toUpperCase() + topic.slice(1),
    time: time.toFixed(1)
  }))

  const improvementData = Object.entries(analytics.improvement_trend).map(([topic, scores]) => {
    const data = scores.map((score, index) => ({
      quiz: `Quiz ${index + 1}`,
      [topic]: score
    }))
    return { topic, data }
  })

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="stat-card" style={{ '--accent-color': color }}>
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  )

  return (
    <div className="performance-analytics">
      <div className="analytics-header">
        <h2>Performance Analytics</h2>
        <div className="analytics-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'topics' ? 'active' : ''}`}
            onClick={() => setActiveTab('topics')}
          >
            Topics
          </button>
          <button 
            className={`tab-button ${activeTab === 'trends' ? 'active' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            Trends
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="analytics-overview">
          <div className="stats-grid">
            <StatCard
              icon={Award}
              title="Total Quizzes"
              value={analytics.total_quizzes}
              color="#3b82f6"
            />
            <StatCard
              icon={Target}
              title="Overall Accuracy"
              value={`${((analytics.total_quizzes > 0 ? (Object.values(analytics.accuracy_by_topic).reduce((a, b) => a + b, 0) / Object.keys(analytics.accuracy_by_topic).length) : 0)).toFixed(1)}%`}
              color="#10b981"
            />
            <StatCard
              icon={Clock}
              title="Avg. Time per Question"
              value={`${((Object.values(analytics.average_time_by_topic).reduce((a, b) => a + b, 0) / Object.keys(analytics.average_time_by_topic).length) || 0).toFixed(1)}s`}
              color="#f59e0b"
            />
            <StatCard
              icon={TrendingUp}
              title="Best Topic"
              value={Object.entries(analytics.accuracy_by_topic).reduce((a, b) => a[1] > b[1] ? a : b, ['', 0])[0].charAt(0).toUpperCase() + Object.entries(analytics.accuracy_by_topic).reduce((a, b) => a[1] > b[1] ? a : b, ['', 0])[0].slice(1)}
              subtitle={`${Object.entries(analytics.accuracy_by_topic).reduce((a, b) => a[1] > b[1] ? a : b, ['', 0])[1].toFixed(1)}% accuracy`}
              color="#8b5cf6"
            />
          </div>

          <div className="charts-grid">
            <div className="chart-container">
              <h3>Accuracy by Difficulty</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={difficultyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="difficulty" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="accuracy" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>Average Time by Topic</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="topic" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="time" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'topics' && (
        <div className="analytics-topics">
          <div className="chart-container full-width">
            <h3>Topic Performance Radar</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={topicAccuracyData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="topic" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Accuracy" dataKey="accuracy" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Topic Accuracy Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topicAccuracyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ topic, accuracy }) => `${topic}: ${accuracy}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="accuracy"
                >
                  {topicAccuracyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="analytics-trends">
          {improvementData.map(({ topic, data }) => (
            <div key={topic} className="chart-container">
              <h3>{topic.charAt(0).toUpperCase() + topic.slice(1)} Improvement Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quiz" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey={topic} stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PerformanceAnalytics
