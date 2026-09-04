import React from 'react';

const Gamification = ({ userData, onClose }) => {
  const allBadges = [
    { id: 'first-step', name: 'First Step', icon: '🥾', desc: 'Completed onboarding', earned: true },
    { id: 'daily-streak', name: '3-Day Streak', icon: '🔥', desc: 'Practice 3 days in row', earned: userData?.sessionsCompleted >= 3 },
    { id: 'stress-master', name: 'Stress Master', icon: '🛡️', desc: '10 stress sessions', earned: false },
    { id: 'sleep-hero', name: 'Sleep Hero', icon: '🌙', desc: 'Week of good sleep', earned: false },
    { id: 'zen-master', name: 'Zen Master', icon: '🧘', desc: '50 sessions total', earned: false },
    { id: 'community', name: 'Social Butterfly', icon: '👥', desc: 'Join community', earned: false }
  ];

  const earnedBadges = allBadges.filter(b => b.earned);
  const nextBadges = allBadges.filter(b => !b.earned).slice(0,3);

  return (
    <div className="gamification-modal" onClick={onClose}>
      <div className="gamification-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🏆 Your Achievements</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        <div className="gamification-content">
          <div className="achievements-stats">
            <div className="stat">
              <div className="stat-big">{earnedBadges.length}</div>
              <div>Badges Earned</div>
            </div>
            <div className="stat">
              <div className="stat-big">{userData?.sessionsCompleted || 0}</div>
              <div>Total Sessions</div>
            </div>
            <div className="stat">
              <div className="stat-big">{Math.round((userData?.progress || 0)/10)}/10</div>
              <div>Levels</div>
            </div>
          </div>

          <div className="badges-grid">
            <div className="section">
              <h3>✅ Earned ({earnedBadges.length})</h3>
              <div className="badges-list">
                {earnedBadges.map(badge => (
                  <div key={badge.id} className="badge earned">
                    <span className="badge-icon">{badge.icon}</span>
                    <div>
                      <h4>{badge.name}</h4>
                      <p>{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <h3>🎯 Next Up ({nextBadges.length})</h3>
              <div className="badges-list">
                {nextBadges.map(badge => (
                  <div key={badge.id} className="badge upcoming">
                    <span className="badge-icon locked">{badge.icon}</span>
                    <div>
                      <h4>{badge.name}</h4>
                      <p>{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="motivation">
            <p>"Every breath you take is progress toward inner peace."</p>
            <button className="share-btn">Share Progress 👥</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gamification;

