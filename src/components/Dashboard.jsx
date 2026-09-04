import React, { useState } from 'react';

const Dashboard = ({ userData, onUpdateUserData, openJournal, openMeditation, openBiofeedback, onLogout }) => {
  const [activeTab, setActiveTab] = useState('recommendations');

  const recommendations = [
    { id: 1, title: 'Stress Relief', subtitle: 'Quick breathing exercises for immediate calm', icon: '💨', duration: '3 min', color: '#EF4444' },
    { id: 2, title: 'Deep Sleep', subtitle: 'Nighttime routine optimizer', icon: '🌙', duration: '12 min', color: '#8B5CF6' },
    { id: 3, title: 'Focus Boost', subtitle: 'Enhanced concentration session', icon: '🎯', duration: '8 min', color: '#3B82F6' },
    { id: 4, title: 'Anxiety Release', subtitle: 'Emergency calm toolkit', icon: '🌀', duration: '5 min', color: '#EC4899' },
    { id: 5, title: 'Energy Reset', subtitle: 'Morning power-up sequence', icon: '⚡', duration: '4 min', color: '#10B981' },
    { id: 6, title: 'Gratitude Practice', subtitle: 'Daily thankfulness flow', icon: '🙏', duration: '6 min', color: '#F59E0B' }
  ];

  const tabs = [
    { id: 'recommendations', label: 'AI Recommendations', icon: '🤖' },
    { id: 'sessions', label: 'All Sessions', icon: '🎧' },
    { id: 'progress', label: 'Progress', icon: '📊' }
  ];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <h1 className="header-logo">MindSeren AI</h1>
          <div className="header-right">
            <span className="header-greeting">Welcome, {userData?.name || 'User'} 👋</span>
            <button onClick={onLogout} className="btn-logout-sm">Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        <div className="dashboard-hero">
          <div className="hero-card-dash">
            <div className="hero-text">
              <h2 className="hero-title-dash">Hello, {userData?.name || 'User'} 👋</h2>
              <p className="hero-subtitle-dash">Your personalized wellness journey continues</p>
            </div>
            <div className="hero-buttons">
              <button onClick={openMeditation} className="btn-hero btn-hero-primary">🎵 Start Session</button>
              <button onClick={openJournal} className="btn-hero btn-hero-secondary">📝 Journal</button>
              <button onClick={openBiofeedback} className="btn-hero btn-hero-accent">📊 Biofeedback</button>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="tab-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${activeTab === tab.id ? 'tab-active' : ''}`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab === 'recommendations' && (
            <div className="rec-grid">
              {recommendations.map((rec) => (
                <div key={rec.id} className="rec-card">
                  <div className="rec-icon" style={{backgroundColor: rec.color + '20'}}>
                    <span>{rec.icon}</span>
                  </div>
                  <div className="rec-body">
                    <h4 className="rec-title">{rec.title}</h4>
                    <p className="rec-subtitle">{rec.subtitle}</p>
                    <div className="rec-footer">
                      <span className="rec-duration">{rec.duration}</span>
                      <button onClick={openMeditation} className="rec-start">Start Now ▶️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="sessions-grid">
              {recommendations.map((rec) => (
                <div key={rec.id} className="session-card-dash">
                  <div className="session-card-top" style={{background: rec.color + '15'}}>
                    <span className="session-card-icon">{rec.icon}</span>
                  </div>
                  <div className="session-card-body">
                    <h4>{rec.title}</h4>
                    <p>{rec.subtitle}</p>
                    <button onClick={openMeditation} className="session-start-btn">Begin Session →</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="progress-grid">
              <div className="progress-stat-card">
                <div className="progress-stat-icon">🎯</div>
                <h3>Sessions</h3>
                <div className="progress-stat-number">{userData?.sessionsCompleted || 12}</div>
                <p>Completed this week</p>
              </div>
              <div className="progress-stat-card">
                <div className="progress-stat-icon">🔥</div>
                <h3>Streak</h3>
                <div className="progress-stat-number streak">{userData?.streak || 5} Days</div>
                <p>Consistent wellness</p>
              </div>
              <div className="progress-stat-card">
                <div className="progress-stat-icon">📈</div>
                <h3>Progress</h3>
                <div className="progress-stat-number progress-val">{userData?.progress || 84}%</div>
                <p>Overall mastery</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;