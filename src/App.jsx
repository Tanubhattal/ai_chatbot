import React, { useState, useEffect } from 'react';
import Chatbot from './components/Chatbot.jsx';
import SentimentAnalyzer from './components/SentimentAnalyzer.jsx';
import MoodTracker from './components/MoodTracker.jsx';
import WellnessActivities from './components/WellnessActivities.jsx';
import Biofeedback from './components/Biofeedback.jsx';
import Onboarding from './components/Onboarding.jsx';
import Journal from './components/Journal.jsx';
import Gamification from './components/Gamification.jsx';
import MeditationPlayer from './components/MeditationPlayer.jsx';

const App = () => {
  const [activeTab, setActiveTab] = useState('chatbot');
  const [theme, setTheme] = useState('light');
  const [userData, setUserData] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showGamification, setShowGamification] = useState(false);
  const [showBiofeedbackModal, setShowBiofeedbackModal] = useState(false);
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('mentalWellnessUserData');
    if (saved) {
      setUserData(JSON.parse(saved));
    }
  }, []);

  const handleOnboardingComplete = (data) => {
    const fullData = {
      ...data,
      sessionsCompleted: 4,
      streak: 3,
      progress: 65,
      journal: []
    };
    setUserData(fullData);
    localStorage.setItem('mentalWellnessUserData', JSON.stringify(fullData));
    setShowOnboarding(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleStartSession = (activity) => {
    setActiveSession(activity);
  };

  return (
    <div className={`app-root theme-${theme}`}>
      {/* Main Top Header Navbar */}
      <header className="main-nav-header">
        <div className="nav-container">
          <div className="brand-logo-group">
            <span className="brand-icon">🧠</span>
            <div>
              <h1 className="brand-title">MindSeren AI</h1>
              <span className="brand-subtitle">AI Mental Health Support Chatbot Using Sentiment Analysis</span>
            </div>
          </div>

          <div className="nav-right-tools">
            <button className="nav-tool-btn" onClick={() => setShowGamification(true)} title="Badges & Streaks">
              🏆 Badges ({userData?.sessionsCompleted || 4})
            </button>
            <button className="nav-tool-btn" onClick={() => setShowJournal(true)} title="AI Journal">
              📝 Journal
            </button>
            <button className="nav-tool-btn" onClick={() => setShowBiofeedbackModal(true)} title="Live Biofeedback">
              📊 Biofeedback
            </button>
            <button className="nav-tool-btn" onClick={() => setShowOnboarding(true)} title="Wellness Profile">
              ⚙️ Profile
            </button>
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="tab-navigation-bar">
        <div className="nav-container">
          <button
            className={`tab-link ${activeTab === 'chatbot' ? 'active' : ''}`}
            onClick={() => setActiveTab('chatbot')}
          >
            <span>🤖</span> AI Support Chatbot
          </button>
          <button
            className={`tab-link ${activeTab === 'sentiment' ? 'active' : ''}`}
            onClick={() => setActiveTab('sentiment')}
          >
            <span>🔬</span> Sentiment & Emotion Analyzer
          </button>
          <button
            className={`tab-link ${activeTab === 'tracker' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracker')}
          >
            <span>📊</span> Mood Pattern Tracker
          </button>
          <button
            className={`tab-link ${activeTab === 'wellness' ? 'active' : ''}`}
            onClick={() => setActiveTab('wellness')}
          >
            <span>🧘</span> Wellness Activities
          </button>
          <button
            className={`tab-link ${activeTab === 'biofeedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('biofeedback')}
          >
            <span>💓</span> Biofeedback & Breathing
          </button>
        </div>
      </nav>

      {/* Main View Area */}
      <main className="main-content-view">
        <div className="view-container">
          {activeTab === 'chatbot' && (
            <Chatbot onOpenActivity={(act) => handleStartSession(act)} />
          )}

          {activeTab === 'sentiment' && (
            <SentimentAnalyzer />
          )}

          {activeTab === 'tracker' && (
            <MoodTracker />
          )}

          {activeTab === 'wellness' && (
            <WellnessActivities
              activeSession={activeSession}
              onStartSession={(act) => handleStartSession(act)}
            />
          )}

          {activeTab === 'biofeedback' && (
            <div className="tab-section-padded">
              <Biofeedback userData={userData} onClose={() => setActiveTab('chatbot')} />
            </div>
          )}
        </div>
      </main>

      {/* Modals & Dialogs */}
      {showOnboarding && (
        <div className="onboarding-overlay" onClick={() => setShowOnboarding(false)}>
          <div onClick={e => e.stopPropagation()}>
            <Onboarding onComplete={handleOnboardingComplete} />
          </div>
        </div>
      )}

      {showJournal && (
        <Journal
          userData={userData}
          onClose={() => setShowJournal(false)}
          onSave={(updated) => setUserData(updated)}
        />
      )}

      {showGamification && (
        <Gamification
          userData={userData}
          onClose={() => setShowGamification(false)}
        />
      )}

      {showBiofeedbackModal && (
        <Biofeedback
          userData={userData}
          onClose={() => setShowBiofeedbackModal(false)}
        />
      )}

      {activeSession && (
        <MeditationPlayer
          session={activeSession.title}
          duration={activeSession.duration ? parseInt(activeSession.duration) * 60 : 180}
          onComplete={(dur) => {
            setUserData(prev => ({
              ...prev,
              sessionsCompleted: (prev?.sessionsCompleted || 0) + 1
            }));
            setActiveSession(null);
          }}
          onClose={() => setActiveSession(null)}
        />
      )}

      {/* Footer */}
      <footer className="main-app-footer">
        <div className="nav-container footer-content">
          <p>© 2026 MindSeren AI • Healthcare NLP Research Project • Powered by Python Flask & Sentiment Analysis</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
