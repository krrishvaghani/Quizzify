import React, { useState } from 'react';
import { Calendar, Flame, Coins, Gift, Zap, Target, Clock, Star } from 'lucide-react';

const EngagementFeatures = () => {
  const [currentStreak, setCurrentStreak] = useState(7);
  const [coins, setCoins] = useState(245);
  
  const dailyChallenge = {
    date: 'March 10, 2024',
    questions: [
      { id: 1, question: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correct: 2 },
      { id: 2, question: 'What is 15 × 8?', options: ['120', '125', '115', '130'], correct: 0 },
      { id: 3, question: 'Who wrote Romeo and Juliet?', options: ['Dickens', 'Shakespeare', 'Austen', 'Wilde'], correct: 1 },
      { id: 4, question: 'What is the largest planet?', options: ['Earth', 'Mars', 'Jupiter', 'Saturn'], correct: 2 },
      { id: 5, question: 'In which year did WWII end?', options: ['1944', '1945', '1946', '1947'], correct: 1 }
    ],
    completed: false,
    reward: 50
  };

  const streakCalendar = [
    { day: 'Mon', completed: true, date: 4 },
    { day: 'Tue', completed: true, date: 5 },
    { day: 'Wed', completed: true, date: 6 },
    { day: 'Thu', completed: true, date: 7 },
    { day: 'Fri', completed: true, date: 8 },
    { day: 'Sat', completed: true, date: 9 },
    { day: 'Sun', completed: true, date: 10 },
  ];

  const rewards = [
    { name: 'Speed Badge', cost: 100, icon: Zap, description: 'Show off your quick thinking' },
    { name: 'Focus Badge', cost: 150, icon: Target, description: 'Display your concentration skills' },
    { name: 'Time Master', cost: 200, icon: Clock, description: 'Prove your time management' },
    { name: 'Quiz Legend', cost: 300, icon: Star, description: 'Ultimate achievement badge' }
  ];

  const achievements = [
    { name: 'First Steps', description: 'Complete your first quiz', earned: true, date: '2 weeks ago' },
    { name: 'Speed Demon', description: 'Answer 10 questions in under 5 minutes', earned: true, date: '1 week ago' },
    { name: 'Perfectionist', description: 'Get 100% on any quiz', earned: true, date: '3 days ago' },
    { name: 'Consistent', description: 'Maintain a 7-day streak', earned: true, date: 'Today' },
    { name: 'Scholar', description: 'Complete 50 quizzes', earned: false, progress: 24 },
    { name: 'Master', description: 'Achieve 90%+ average across 20 quizzes', earned: false, progress: 12 }
  ];

  return (
    <div className="engagement-features-section">
      <div className="engagement-header">
        <h2 className="section-title">Daily Challenges & Rewards</h2>
        <p className="section-subtitle">Stay motivated with daily goals and achievements</p>
      </div>

      {/* Daily Challenge */}
      <div className="daily-challenge">
        <div className="challenge-header">
          <div className="challenge-title">
            <Calendar size={24} />
            <h3>Daily Quiz Challenge</h3>
          </div>
          <div className="challenge-reward">
            <Coins size={20} />
            <span>+{dailyChallenge.reward} coins</span>
          </div>
        </div>
        
        <div className="challenge-content">
          <div className="challenge-info">
            <p>Complete today's 5-question challenge to earn coins and maintain your streak!</p>
            <div className="challenge-meta">
              <span>📅 {dailyChallenge.date}</span>
              <span>⏱️ 5 minutes</span>
              <span>🎯 Mixed Topics</span>
            </div>
          </div>
          
          <div className="challenge-actions">
            {!dailyChallenge.completed ? (
              <button className="challenge-btn primary">
                <Zap size={18} />
                Start Challenge
              </button>
            ) : (
              <div className="challenge-completed">
                <span>✅ Completed!</span>
                <span>+{dailyChallenge.reward} coins earned</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Streak Tracker */}
      <div className="streak-section">
        <div className="streak-header">
          <div className="streak-title">
            <Flame size={24} />
            <h3>Learning Streak</h3>
          </div>
          <div className="streak-count">
            <span className="streak-number">{currentStreak}</span>
            <span className="streak-label">days</span>
          </div>
        </div>
        
        <div className="streak-calendar">
          {streakCalendar.map((day, index) => (
            <div key={index} className={`calendar-day ${day.completed ? 'completed' : 'pending'}`}>
              <span className="day-name">{day.day}</span>
              <span className="day-date">{day.date}</span>
              {day.completed && <div className="day-flame">🔥</div>}
            </div>
          ))}
        </div>
        
        <div className="streak-motivation">
          <p>Keep it up! You're on fire 🔥</p>
          <div className="next-milestone">
            <span>Next milestone: 10 days (3 more to go!)</span>
          </div>
        </div>
      </div>

      {/* Coins & Rewards */}
      <div className="rewards-section">
        <div className="coins-display">
          <div className="coins-header">
            <Coins size={28} />
            <div className="coins-info">
              <h3>Your Coins</h3>
              <div className="coins-count">{coins}</div>
            </div>
          </div>
          <div className="coins-earning">
            <p>Earn coins by:</p>
            <ul>
              <li>Completing daily challenges (+50)</li>
              <li>Maintaining streaks (+10/day)</li>
              <li>Perfect quiz scores (+25)</li>
              <li>First attempt success (+15)</li>
            </ul>
          </div>
        </div>

        <div className="rewards-shop">
          <h3 className="shop-title">
            <Gift size={20} />
            Rewards Shop
          </h3>
          <div className="rewards-grid">
            {rewards.map((reward, index) => {
              const IconComponent = reward.icon;
              const canAfford = coins >= reward.cost;
              
              return (
                <div key={index} className={`reward-item ${canAfford ? 'affordable' : 'expensive'}`}>
                  <div className="reward-icon">
                    <IconComponent size={24} />
                  </div>
                  <div className="reward-content">
                    <h4 className="reward-name">{reward.name}</h4>
                    <p className="reward-description">{reward.description}</p>
                    <div className="reward-cost">
                      <Coins size={16} />
                      <span>{reward.cost}</span>
                    </div>
                  </div>
                  <button className={`redeem-btn ${canAfford ? 'enabled' : 'disabled'}`}>
                    {canAfford ? 'Redeem' : 'Need More'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h3 className="achievements-title">
          <Star size={20} />
          Achievements
        </h3>
        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <div key={index} className={`achievement-item ${achievement.earned ? 'earned' : 'locked'}`}>
              <div className="achievement-icon">
                {achievement.earned ? '🏆' : '🔒'}
              </div>
              <div className="achievement-content">
                <h4 className="achievement-name">{achievement.name}</h4>
                <p className="achievement-description">{achievement.description}</p>
                {achievement.earned ? (
                  <span className="achievement-date">Earned {achievement.date}</span>
                ) : (
                  <div className="achievement-progress">
                    <span>Progress: {achievement.progress}/50</span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${(achievement.progress / 50) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EngagementFeatures;
