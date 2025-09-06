import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Target, TrendingDown, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const SubjectBreakdown = () => {
  const [subjectData, setSubjectData] = useState(null);
  const [viewType, setViewType] = useState('bar'); // 'bar' or 'donut'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjectData();
  }, []);

  const fetchSubjectData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/analytics/subject-breakdown', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setSubjectData(data);
    } catch (error) {
      console.error('Error fetching subject data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4', '#6B7280'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.subject}</p>
          <p className="text-blue-600">Average Score: {data.average_score}%</p>
          <p className="text-green-600">Accuracy: {data.accuracy}%</p>
          <p className="text-gray-600">Quizzes: {data.total_quizzes}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!subjectData || subjectData.data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject-Wise Performance</h3>
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <div className="text-gray-400 text-lg mb-2">No subject data available</div>
          <p className="text-gray-500">Take quizzes in different subjects to see your breakdown!</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Subject-Wise Performance</h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewType('bar')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewType === 'bar' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Bar Chart
          </button>
          <button
            onClick={() => setViewType('donut')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewType === 'donut' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Donut Chart
          </button>
        </div>
      </div>

      {/* Performance Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {subjectData.strongest_subject && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Strongest Subject</span>
            </div>
            <div className="text-lg font-bold text-green-900">{subjectData.strongest_subject.subject}</div>
            <div className="text-sm text-green-700">{subjectData.strongest_subject.average_score}% average</div>
          </div>
        )}

        {subjectData.weakest_subject && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-800">Needs Improvement</span>
            </div>
            <div className="text-lg font-bold text-red-900">{subjectData.weakest_subject.subject}</div>
            <div className="text-sm text-red-700">{subjectData.weakest_subject.average_score}% average</div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Total Subjects</span>
          </div>
          <div className="text-lg font-bold text-blue-900">{subjectData.total_subjects}</div>
          <div className="text-sm text-blue-700">Subjects attempted</div>
        </div>
      </div>

      {/* Chart Display */}
      <div className="h-64">
        {viewType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectData.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="subject" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                domain={[0, 100]}
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="average_score" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectData.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="average_score"
                >
                  {subjectData.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="space-y-2">
                {subjectData.data.map((entry, index) => (
                  <div key={entry.subject} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-gray-700">{entry.subject}</span>
                    <span className="text-gray-500">({entry.average_score}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subject Details */}
      <div className="mt-6 space-y-2">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Detailed Breakdown</h4>
        {subjectData.data.map((subject, index) => (
          <div key={subject.subject} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="font-medium text-gray-800">{subject.subject}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600">{subject.total_quizzes} quizzes</span>
              <span className="text-gray-600">{subject.accuracy}% accuracy</span>
              <span className="font-semibold text-gray-800">{subject.average_score}%</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SubjectBreakdown;
