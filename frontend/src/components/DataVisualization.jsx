import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieIcon, Activity } from 'lucide-react';

const DataVisualization = ({ performanceData }) => {
  // Sample data - replace with real data
  const scoreHistory = [
    { date: 'Mon', score: 78, questions: 10 },
    { date: 'Tue', score: 85, questions: 15 },
    { date: 'Wed', score: 92, questions: 12 },
    { date: 'Thu', score: 88, questions: 18 },
    { date: 'Fri', score: 94, questions: 20 },
    { date: 'Sat', score: 89, questions: 14 },
    { date: 'Sun', score: 96, questions: 16 }
  ];

  const accuracyData = [
    { name: 'Correct', value: 156, color: '#22c55e' },
    { name: 'Incorrect', value: 24, color: '#ef4444' }
  ];

  const topicStrengths = [
    { topic: 'Math', strength: 95, weakness: 5 },
    { topic: 'Science', strength: 88, weakness: 12 },
    { topic: 'History', strength: 76, weakness: 24 },
    { topic: 'Literature', strength: 92, weakness: 8 },
    { topic: 'Geography', strength: 84, weakness: 16 },
    { topic: 'Technology', strength: 90, weakness: 10 }
  ];

  const radarData = [
    { subject: 'Math', A: 95, fullMark: 100 },
    { subject: 'Science', A: 88, fullMark: 100 },
    { subject: 'History', A: 76, fullMark: 100 },
    { subject: 'Literature', A: 92, fullMark: 100 },
    { subject: 'Geography', A: 84, fullMark: 100 },
    { subject: 'Technology', A: 90, fullMark: 100 }
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#f97316', '#eab308', '#22c55e', '#ef4444'];

  return (
    <div className="data-visualization-section">
      <div className="visualization-header">
        <h2 className="section-title">Performance Analytics</h2>
        <p className="section-subtitle">Visual insights into your learning progress</p>
      </div>

      <div className="charts-grid">
        {/* Score History Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <BarChart3 size={20} />
            <h3>Score History</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                  }}
                />
                <Bar dataKey="score" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Trend Line Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <TrendingUp size={20} />
            <h3>Performance Trend</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#8b5cf6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accuracy Pie Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <PieIcon size={20} />
            <h3>Answer Accuracy</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={accuracyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {accuracyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {accuracyData.map((entry, index) => (
                <div key={index} className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: entry.color }}></div>
                  <span>{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Topic Strengths Radar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <Activity size={20} />
            <h3>Topic Strengths</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748b' }} />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                />
                <Radar
                  name="Performance"
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Topic Heatmap */}
      <div className="heatmap-section">
        <h3 className="subsection-title">Strengths & Weaknesses by Topic</h3>
        <div className="heatmap-grid">
          {topicStrengths.map((topic, index) => (
            <div key={index} className="heatmap-item">
              <div className="topic-name">{topic.topic}</div>
              <div className="strength-bar">
                <div 
                  className="strength-fill" 
                  style={{ 
                    width: `${topic.strength}%`,
                    backgroundColor: topic.strength >= 90 ? '#22c55e' : 
                                   topic.strength >= 80 ? '#eab308' : 
                                   topic.strength >= 70 ? '#f97316' : '#ef4444'
                  }}
                ></div>
              </div>
              <div className="strength-percentage">{topic.strength}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
