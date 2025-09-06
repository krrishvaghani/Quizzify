import React, { useState } from 'react';
import { Trophy, Medal, Crown, Users, TrendingUp, Clock, Target, Star } from 'lucide-react';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('global');

  const globalLeaderboard = [
    { rank: 1, name: 'Alex Chen', score: 2847, streak: 15, avatar: '👨‍💻', badge: 'Quiz Master' },
    { rank: 2, name: 'Sarah Johnson', score: 2756, streak: 12, avatar: '👩‍🎓', badge: 'Speed Demon' },
    { rank: 3, name: 'Mike Rodriguez', score: 2689, streak: 8, avatar: '👨‍🔬', badge: 'Consistent' },
    { rank: 4, name: 'Emma Wilson', score: 2634, streak: 10, avatar: '👩‍💼', badge: 'Rising Star' },
    { rank: 5, name: 'David Kim', score: 2598, streak: 6, avatar: '👨‍🎨', badge: 'Challenger' },
    { rank: 6, name: 'Lisa Zhang', score: 2567, streak: 9, avatar: '👩‍🔬', badge: 'Focused' },
    { rank: 7, name: 'You', score: 2489, streak: 7, avatar: '🎯', badge: 'Learner', isCurrentUser: true }
  ];

  const weeklyLeaderboard = [
    { rank: 1, name: 'Sarah Johnson', weeklyScore: 456, quizzes: 8, avatar: '👩‍🎓' },
    { rank: 2, name: 'You', weeklyScore: 423, quizzes: 7, avatar: '🎯', isCurrentUser: true },
    { rank: 3, name: 'Mike Rodriguez', weeklyScore: 398, quizzes: 6, avatar: '👨‍🔬' },
    { rank: 4, name: 'Emma Wilson', weeklyScore: 387, quizzes: 5, avatar: '👩‍💼' },
    { rank: 5, name: 'David Kim', weeklyScore: 356, quizzes: 6, avatar: '👨‍🎨' }
  ];

  const friends = [
    { name: 'Jessica Park', score: 2234, status: 'online', avatar: '👩‍💻', lastActive: 'now' },
    { name: 'Tom Anderson', score: 2156, status: 'offline', avatar: '👨‍🎓', lastActive: '2h ago' },
    { name: 'Maria Garcia', score: 2089, status: 'online', avatar: '👩‍🎨', lastActive: 'now' },
    { name: 'James Liu', score: 1967, status: 'offline', avatar: '👨‍💼', lastActive: '1d ago' }
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="rank-icon gold" size={20} />;
      case 2: return <Medal className="rank-icon silver" size={20} />;
      case 3: return <Medal className="rank-icon bronze" size={20} />;
      default: return <span className="rank-number">{rank}</span>;
    }
  };

  return (
    <div className="leaderboard-section">
      <div className="leaderboard-header">
        <h2 className="section-title">
          <Trophy size={24} />
          Leaderboard & Social
        </h2>
        <p className="section-subtitle">Compete with learners worldwide</p>
      </div>

      {/* Tab Navigation */}
      <div className="leaderboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'global' ? 'active' : ''}`}
          onClick={() => setActiveTab('global')}
        >
          <Trophy size={18} />
          Global
        </button>
        <button 
          className={`tab-btn ${activeTab === 'weekly' ? 'active' : ''}`}
          onClick={() => setActiveTab('weekly')}
        >
          <TrendingUp size={18} />
          This Week
        </button>
        <button 
          className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          <Users size={18} />
          Friends
        </button>
      </div>

      {/* Global Leaderboard */}
      {activeTab === 'global' && (
        <div className="global-leaderboard">
          <div className="leaderboard-list">
            {globalLeaderboard.map((user, index) => (
              <div key={index} className={`leaderboard-item ${user.isCurrentUser ? 'current-user' : ''}`}>
                <div className="user-rank">
                  {getRankIcon(user.rank)}
                </div>
                <div className="user-avatar">{user.avatar}</div>
                <div className="user-info">
                  <h4 className="user-name">{user.name}</h4>
                  <span className="user-badge">{user.badge}</span>
                </div>
                <div className="user-stats">
                  <div className="stat-item">
                    <Target size={14} />
                    <span>{user.score}</span>
                  </div>
                  <div className="stat-item">
                    <Star size={14} />
                    <span>{user.streak}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Leaderboard */}
      {activeTab === 'weekly' && (
        <div className="weekly-leaderboard">
          <div className="week-header">
            <h3>This Week's Top Performers</h3>
            <span className="week-period">March 4-10, 2024</span>
          </div>
          <div className="leaderboard-list">
            {weeklyLeaderboard.map((user, index) => (
              <div key={index} className={`leaderboard-item ${user.isCurrentUser ? 'current-user' : ''}`}>
                <div className="user-rank">
                  {getRankIcon(user.rank)}
                </div>
                <div className="user-avatar">{user.avatar}</div>
                <div className="user-info">
                  <h4 className="user-name">{user.name}</h4>
                  <span className="user-quizzes">{user.quizzes} quizzes</span>
                </div>
                <div className="user-stats">
                  <div className="weekly-score">{user.weeklyScore} pts</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends */}
      {activeTab === 'friends' && (
        <div className="friends-section">
          <div className="friends-header">
            <h3>Your Friends</h3>
            <button className="add-friends-btn">
              <Users size={16} />
              Add Friends
            </button>
          </div>
          <div className="friends-list">
            {friends.map((friend, index) => (
              <div key={index} className="friend-item">
                <div className="friend-avatar">{friend.avatar}</div>
                <div className="friend-info">
                  <h4 className="friend-name">{friend.name}</h4>
                  <div className="friend-status">
                    <span className={`status-indicator ${friend.status}`}></span>
                    <span className="last-active">{friend.lastActive}</span>
                  </div>
                </div>
                <div className="friend-score">{friend.score} pts</div>
                <div className="friend-actions">
                  <button className="challenge-btn">Challenge</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Sharing */}
      <div className="achievement-sharing">
        <h3 className="subsection-title">Share Your Success</h3>
        <div className="sharing-options">
          <div className="achievement-card">
            <div className="achievement-content">
              <Trophy className="achievement-icon" size={32} />
              <div className="achievement-text">
                <h4>Quiz Master Achievement</h4>
                <p>Completed 25 quizzes with 85%+ average score</p>
              </div>
            </div>
            <button className="share-btn">
              <span>Share Certificate</span>
            </button>
          </div>
          
          <div className="result-card">
            <div className="result-content">
              <div className="result-score">94%</div>
              <div className="result-text">
                <h4>Latest Quiz Result</h4>
                <p>Advanced Mathematics - Hard Level</p>
              </div>
            </div>
            <button className="share-btn">
              <span>Share Result</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
