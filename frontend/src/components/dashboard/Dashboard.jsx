import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Brain, 
  Target, 
  Clock, 
  Award,
  BookOpen,
  Zap
} from 'lucide-react';
import PerformanceChart from './PerformanceChart';
import SubjectBreakdown from './SubjectBreakdown';

const Dashboard = () => {
  const [userStats, setUserStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch multiple endpoints in parallel
      const [statsResponse, activityResponse] = await Promise.all([
        fetch('/api/analytics/performance-over-time', { headers }),
        fetch('/api/analytics/recent-activity', { headers })
      ]);

      const [statsData, activityData] = await Promise.all([
        statsResponse.json(),
        activityResponse.json()
      ]);

      setUserStats(statsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className={`inline-flex p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{value}</h3>
          <p className="text-sm text-gray-600">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${
            trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </motion.div>
  );

  const QuickActionCard = ({ icon: Icon, title, description, onClick, color }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg p-6 text-left hover:shadow-xl transition-all w-full"
    >
      <div className={`inline-flex p-3 rounded-lg ${color} mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your learning progress and performance</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            title="Total Quizzes"
            value={userStats?.total_quizzes || 0}
            subtitle="Completed this month"
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            trend={userStats?.improvement}
          />
          <StatCard
            icon={Target}
            title="Average Score"
            value={`${userStats?.average_score || 0}%`}
            subtitle="Across all subjects"
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            icon={Zap}
            title="Current Streak"
            value="7 days"
            subtitle="Keep it up!"
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <StatCard
            icon={Award}
            title="Achievements"
            value="12"
            subtitle="Badges earned"
            color="bg-gradient-to-r from-orange-500 to-orange-600"
          />
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PerformanceChart />
          <SubjectBreakdown />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard
              icon={Brain}
              title="Start Quiz"
              description="Begin a new adaptive quiz session"
              onClick={() => window.location.href = '/app/quiz'}
              color="bg-gradient-to-r from-blue-500 to-blue-600"
            />
            <QuickActionCard
              icon={BarChart3}
              title="View Analytics"
              description="Detailed performance insights"
              onClick={() => window.location.href = '/app/analytics'}
              color="bg-gradient-to-r from-green-500 to-green-600"
            />
            <QuickActionCard
              icon={Target}
              title="Set Goals"
              description="Define your learning objectives"
              onClick={() => window.location.href = '/app/goals'}
              color="bg-gradient-to-r from-purple-500 to-purple-600"
            />
            <QuickActionCard
              icon={Clock}
              title="Study Plan"
              description="Create a personalized study schedule"
              onClick={() => window.location.href = '/app/study-plan'}
              color="bg-gradient-to-r from-orange-500 to-orange-600"
            />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          {recentActivity && recentActivity.data.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.data.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Completed {activity.quizzes_taken} quiz{activity.quizzes_taken !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{activity.average_score}%</p>
                    <p className="text-xs text-gray-500">avg score</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
              <p className="text-sm text-gray-400">Start taking quizzes to see your activity here</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
