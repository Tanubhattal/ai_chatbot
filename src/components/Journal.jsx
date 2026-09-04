import React, { useState } from 'react';
import mlService from '../services/mlService.js';

const Journal = ({ userData, onClose, onSave }) => {
  const [entry, setEntry] = useState('');
  const [sentiment, setSentiment] = useState(null);
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // AI Sentiment Analysis
      const analysis = await mlService.analyzeSentiment(entry);
      setSentiment(analysis);
      
      // Generate AI insights
      const suggestions = generateInsights(analysis, entry);
      setInsights(suggestions);
      
      // Save to user data
      const updatedData = {
        ...userData,
        journal: [...(userData.journal || []), {
          text: entry,
          sentiment: analysis,
          date: new Date().toLocaleDateString(),
          insights: suggestions
        }],
        sessionsCompleted: (userData.sessionsCompleted || 0) + 1
      };
      
      onSave && onSave(updatedData);
      localStorage.setItem('mentalWellnessData', JSON.stringify(updatedData));
      
    } catch (error) {
      console.error('Journal error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (analysis, text) => {
    const score = analysis.score || 0;
    if (score > 0.5) {
      return '✨ Positive energy detected! Consider gratitude meditation.';
    } else if (score > 0) {
      return '😐 Neutral state. Try mindfulness practice.';
    } else {
      return '🌧️ Low mood detected. Recommended: stress relief breathing.';
    }
  };

  return (
    <div className="journal-modal" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h2>📝 AI Journal</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </header>
        
        <form onSubmit={handleSubmit}>
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="How are you feeling today? What happened?..."
            className="journal-textarea"
            rows="8"
            required
          />
          
          {sentiment && (
            <div className="sentiment-display">
              <h4>AI Analysis:</h4>
              <div className="sentiment-score">
                Sentiment: {sentiment.label} ({Math.round(sentiment.score * 100)}%)
              </div>
              <div className="insight-box">
                <strong>AI Insight:</strong> {insights}
              </div>
            </div>
          )}
          
          <div className="journal-actions">
            <button 
              type="submit" 
              disabled={loading || !entry.trim()}
              className="submit-journal"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing with AI...
                </>
              ) : (
                'Save & Get AI Insights'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Journal;

