import React, { useState, useEffect } from 'react';
import { getMoodHistory, saveMoodLog } from '../services/mlService.js';

const MoodTracker = () => {
  const [history, setHistory] = useState([]);
  const [newMood, setNewMood] = useState('Calm');
  const [newNote, setNewNote] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getMoodHistory();
    setHistory(data);
  };

  const handleAddMood = async (e) => {
    e.preventDefault();
    const moodMap = {
      Happy: { score: 0.8, emotion: 'happiness' },
      Calm: { score: 0.5, emotion: 'happiness' },
      Neutral: { score: 0.0, emotion: 'neutral' },
      Anxious: { score: -0.4, emotion: 'anxiety' },
      Stressed: { score: -0.5, emotion: 'stress' },
      Sad: { score: -0.7, emotion: 'sadness' }
    };
    const details = moodMap[newMood] || { score: 0.0, emotion: 'neutral' };

    const entry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      mood: newMood,
      sentimentScore: details.score,
      emotion: details.emotion,
      note: newNote || 'Manual check-in'
    };

    const updated = await saveMoodLog(entry);
    setHistory(updated);
    setNewNote('');
  };

  const filteredHistory = selectedFilter === 'All' 
    ? history 
    : history.filter(h => h.mood === selectedFilter || h.emotion === selectedFilter.toLowerCase());

  // Calculate stats
  const totalEntries = history.length;
  const positiveCount = history.filter(h => h.sentimentScore > 0.1).length;
  const negativeCount = history.filter(h => h.sentimentScore < -0.1).length;
  const avgScore = totalEntries === 0 ? 0 : Math.round((history.reduce((acc, curr) => acc + curr.sentimentScore, 0) / totalEntries) * 100);

  return (
    <div className="mood-tracker-container">
      <div className="hub-header">
        <h2 className="hub-title">📊 Longitudinal Mood Pattern Tracker</h2>
        <p className="hub-subtitle">
          Track emotional trajectories over time, identify triggers, and monitor sentiment progress
        </p>
      </div>

      {/* Stats Header Grid */}
      <div className="mood-stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📅</span>
          <div>
            <div className="stat-value">{totalEntries}</div>
            <div className="stat-label">Total Check-Ins</div>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">📈</span>
          <div>
            <div className="stat-value">{avgScore > 0 ? `+${avgScore}%` : `${avgScore}%`}</div>
            <div className="stat-label">Average Sentiment Index</div>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">☀️</span>
          <div>
            <div className="stat-value">{positiveCount}</div>
            <div className="stat-label">Positive Days</div>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🌧️</span>
          <div>
            <div className="stat-value">{negativeCount}</div>
            <div className="stat-label">Stress/Anxiety Days</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Trend Chart & Quick Logger */}
      <div className="tracker-main-grid">
        {/* Visual Trend Chart */}
        <div className="chart-card">
          <h3>7-Day Emotional Sentiment Trend</h3>
          <div className="visual-trend-chart">
            {history.slice(-7).map((item, idx) => {
              // Convert sentimentScore (-1 to +1) to percentage height (10% to 100%)
              const heightPct = Math.max(15, Math.min(100, Math.round(((item.sentimentScore + 1) / 2) * 90 + 10)));
              const isPositive = item.sentimentScore >= 0;
              return (
                <div key={idx} className="chart-bar-column">
                  <span className="bar-val-top">{item.sentimentScore > 0 ? `+${item.sentimentScore}` : item.sentimentScore}</span>
                  <div className="bar-wrapper">
                    <div
                      className={`chart-bar-fill ${isPositive ? 'pos' : 'neg'}`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="bar-date">{item.date.substring(5)}</span>
                  <span className="bar-mood-tag">{item.mood}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Log Entry Form */}
        <div className="add-mood-card">
          <h3>Log Current Emotional State</h3>
          <form onSubmit={handleAddMood}>
            <div className="form-group">
              <label>How are you feeling right now?</label>
              <select
                className="form-select"
                value={newMood}
                onChange={(e) => setNewMood(e.target.value)}
              >
                <option value="Happy">Happy 😊</option>
                <option value="Calm">Calm 😌</option>
                <option value="Neutral">Neutral 😐</option>
                <option value="Anxious">Anxious 😰</option>
                <option value="Stressed">Stressed 😤</option>
                <option value="Sad">Sad 😔</option>
              </select>
            </div>

            <div className="form-group">
              <label>Note / Trigger (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="What contributed to this mood?"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary btn-fullwidth">
              + Save Mood Log
            </button>
          </form>
        </div>
      </div>

      {/* History Log Table */}
      <div className="mood-history-card">
        <div className="history-header">
          <h3>Mood History Logs</h3>
          <div className="filter-buttons">
            {['All', 'Happy', 'Calm', 'Anxious', 'Stressed', 'Sad'].map(filter => (
              <button
                key={filter}
                className={`filter-btn ${selectedFilter === filter ? 'active' : ''}`}
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="history-table-wrapper">
          <table className="mood-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Mood State</th>
                <th>Sentiment Polarity</th>
                <th>Notes / Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((entry) => (
                <tr key={entry.id}>
                  <td className="td-date">{entry.date}</td>
                  <td>
                    <span className={`mood-pill mood-${entry.mood.toLowerCase()}`}>
                      {entry.mood}
                    </span>
                  </td>
                  <td>
                    <span className={`sentiment-score-badge ${entry.sentimentScore >= 0 ? 'pos' : 'neg'}`}>
                      {entry.sentimentScore >= 0 ? `+${entry.sentimentScore}` : entry.sentimentScore}
                    </span>
                  </td>
                  <td className="td-note">{entry.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
