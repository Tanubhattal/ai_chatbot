import React, { useState } from 'react';
import { analyzeSentiment } from '../services/mlService.js';

const SentimentAnalyzer = () => {
  const [testText, setTestText] = useState(
    "I'm feeling very anxious and stressed about my upcoming project evaluation, but I am trying my best to stay positive."
  );
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sampleTexts = [
    "I'm feeling so anxious about my exams tomorrow, I can't sleep.",
    "I had an amazing day with my friends today, I feel so happy and fulfilled!",
    "Everything feels heavy and sad right now. I just want to be alone.",
    "Work has been extremely stressful with non-stop deadlines and no rest.",
    "I took a peaceful morning walk in the park and read a good book."
  ];

  const handleAnalyze = async () => {
    if (!testText.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeSentiment(testText);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="sentiment-hub-container">
      <div className="hub-header">
        <h2 className="hub-title">🔬 NLP Sentiment & Emotion Analyzer Lab</h2>
        <p className="hub-subtitle">
          Test Natural Language Processing algorithms for multi-class emotion detection & polarity score analysis
        </p>
      </div>

      <div className="analyzer-grid">
        {/* Left Column - Input Panel */}
        <div className="analyzer-input-card">
          <h3>1. Input Text Message</h3>
          <textarea
            className="analyzer-textarea"
            rows="6"
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Type or paste any message to evaluate sentiment and emotional state..."
          />

          <div className="sample-chips-box">
            <span>Try sample phrases:</span>
            <div className="chips-list">
              {sampleTexts.map((sample, idx) => (
                <button
                  key={idx}
                  className="sample-btn"
                  onClick={() => setTestText(sample)}
                >
                  "{sample.substring(0, 32)}..."
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn-run-analysis"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !testText.trim()}
          >
            {isAnalyzing ? 'Running NLP Pipeline...' : '⚡ Run Sentiment & Emotion Analysis'}
          </button>
        </div>

        {/* Right Column - Results Panel */}
        <div className="analyzer-results-card">
          <h3>2. AI NLP Diagnostic Results</h3>

          {!analysisResult ? (
            <div className="empty-analysis-placeholder">
              <div className="placeholder-icon">🧠</div>
              <p>Click <strong>Run Sentiment & Emotion Analysis</strong> to view real-time score breakdowns, valence, and emotion confidence.</p>
            </div>
          ) : (
            <div className="analysis-details-view">
              {/* Top Highlights */}
              <div className="analysis-metrics-row">
                <div className="metric-box">
                  <span className="metric-title">Dominant Emotion</span>
                  <div className="metric-value-huge">
                    {analysisResult.emotion?.meta?.icon || '😐'}{' '}
                    <span style={{ color: analysisResult.emotion?.meta?.color || '#6366F1' }}>
                      {analysisResult.emotion?.dominant?.toUpperCase()}
                    </span>
                  </div>
                  <span className="metric-sub">Confidence: {analysisResult.emotion?.confidencePercent}%</span>
                </div>

                <div className="metric-box">
                  <span className="metric-title">Sentiment Polarity</span>
                  <div className="metric-value-huge">
                    {analysisResult.sentiment?.polarity > 0 ? '➕' : (analysisResult.sentiment?.polarity < 0 ? '➖' : '⚪')} {analysisResult.sentiment?.polarity}
                  </div>
                  <span className={`polarity-badge ${analysisResult.sentiment?.label?.toLowerCase()}`}>
                    {analysisResult.sentiment?.label}
                  </span>
                </div>
              </div>

              {/* Emotion Score Distribution Bars */}
              <div className="emotion-breakdown-section">
                <h4>Multi-Class Emotion Intensity Scores</h4>
                {analysisResult.emotion?.scores && (
                  <div className="scores-list">
                    {Object.entries(analysisResult.emotion.scores).map(([emotionKey, score]) => {
                      const maxPossibleScore = 4.0;
                      const pct = Math.min(100, Math.round((score / maxPossibleScore) * 100));
                      const colors = {
                        anxiety: '#3B82F6',
                        stress: '#EF4444',
                        sadness: '#8B5CF6',
                        happiness: '#10B981',
                        anger: '#F59E0B'
                      };
                      return (
                        <div key={emotionKey} className="emotion-score-item">
                          <div className="score-label-row">
                            <span className="score-name">{emotionKey.toUpperCase()}</span>
                            <span className="score-val">{score} pts ({pct}%)</span>
                          </div>
                          <div className="score-bar-bg">
                            <div
                              className="score-bar-fill"
                              style={{ width: `${pct}%`, backgroundColor: colors[emotionKey] || '#6366F1' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Generated Empathetic Response */}
              <div className="empathetic-output-box">
                <h4>Generative Empathetic Response:</h4>
                <p className="empathetic-text">"{analysisResult.empatheticResponse}"</p>
              </div>

              {/* Raw JSON Payload */}
              <details className="raw-json-details">
                <summary>Inspect Raw API Response (JSON)</summary>
                <pre className="json-code-block">{JSON.stringify(analysisResult, null, 2)}</pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalyzer;
