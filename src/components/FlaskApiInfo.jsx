import React, { useState, useEffect } from 'react';
import { checkFlaskHealth, setApiMode } from '../services/mlService.js';

const FlaskApiInfo = () => {
  const [flaskStatus, setFlaskStatus] = useState({ online: false, data: null });
  const [activeMode, setActiveMode] = useState('auto');
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    testHealth();
  }, []);

  const testHealth = async () => {
    setIsTesting(true);
    const status = await checkFlaskHealth();
    setFlaskStatus(status);
    setIsTesting(false);
  };

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    setApiMode(mode);
  };

  return (
    <div className="flask-info-container">
      {/* Project Overview Header */}
      <div className="project-banner-card">
        <div className="project-banner-header">
          <div>
            <span className="project-badge">RESEARCH PROJECT</span>
            <h2 className="project-title-heading">AI Mental Health Support Chatbot Using Sentiment Analysis</h2>
          </div>
          <div className="status-pill-box">
            <span className={`status-dot ${flaskStatus.online ? 'green' : 'amber'}`}></span>
            <span>Flask Server: {flaskStatus.online ? 'Online (Port 5000)' : 'Browser Engine Fallback'}</span>
          </div>
        </div>

        <div className="project-meta-grid">
          <div className="meta-item">
            <span className="meta-label">Supervisor:</span>
            <strong className="meta-val highlight">Prabjot Singh Bali (E16592)</strong>
          </div>
          <div className="meta-item">
            <span className="meta-label">Verticals:</span>
            <span className="meta-val">NLP AI Healthcare</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Complexity Level:</span>
            <span className="meta-val">Intermediate</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Prerequisites:</span>
            <span className="meta-val">NLP AI • Mental description Python Flask • LLM API • Sentiment analysis</span>
          </div>
        </div>
      </div>

      {/* Backend API Connection & Control Panel */}
      <div className="flask-control-grid">
        <div className="control-card">
          <h3>⚡ Python Flask Backend Connection</h3>
          <p>
            This application is powered by a Python Flask REST API backend (`backend/app.py`). You can toggle execution modes below:
          </p>

          <div className="mode-toggle-group">
            <button
              className={`btn-mode ${activeMode === 'auto' ? 'active' : ''}`}
              onClick={() => handleModeChange('auto')}
            >
              🔄 Auto-Detect (Flask + Fallback)
            </button>
            <button
              className={`btn-mode ${activeMode === 'flask' ? 'active' : ''}`}
              onClick={() => handleModeChange('flask')}
            >
              🐍 Force Flask API (`localhost:5000`)
            </button>
            <button
              className={`btn-mode ${activeMode === 'browser' ? 'active' : ''}`}
              onClick={() => handleModeChange('browser')}
            >
              🌐 Standalone Browser NLP
            </button>
          </div>

          <div className="health-check-row">
            <button className="btn-health-check" onClick={testHealth} disabled={isTesting}>
              {isTesting ? 'Pinging http://localhost:5000...' : '🔌 Test Flask Backend Connection'}
            </button>
            <span className="health-result">
              {flaskStatus.online ? '✅ Connection Successful! Flask API is active.' : '⚠️ Flask Server not detected on port 5000. Running Browser NLP fallback.'}
            </span>
          </div>
        </div>

        {/* Instructions to Run Flask Server */}
        <div className="control-card">
          <h3>💻 How to Run Python Flask Backend</h3>
          <p>Evaluation panelists & supervisors can run the Flask server with the following terminal commands:</p>
          
          <pre className="terminal-code">
{`# 1. Navigate to backend directory
cd "backend"

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start Python Flask Backend Server
python app.py`}
          </pre>
        </div>
      </div>

      {/* API Endpoints & NLP Architecture Documentation */}
      <div className="api-docs-card">
        <h3>📋 REST API Endpoints Specification</h3>
        <table className="endpoints-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Endpoint</th>
              <th>Description</th>
              <th>Payload / Parameters</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="method post">POST</span></td>
              <td><code>/api/chat</code></td>
              <td>Main AI Chatbot endpoint returning multi-class emotion & empathetic response</td>
              <td><code>&#123; "message": "I feel anxious" &#125;</code></td>
            </tr>
            <tr>
              <td><span className="method post">POST</span></td>
              <td><code>/api/analyze</code></td>
              <td>Detailed NLP Sentiment polarity and multi-class emotion score distribution</td>
              <td><code>&#123; "text": "Sample text..." &#125;</code></td>
            </tr>
            <tr>
              <td><span className="method get">GET</span></td>
              <td><code>/api/mood-history</code></td>
              <td>Retrieve longitudinal mood history entries</td>
              <td>None</td>
            </tr>
            <tr>
              <td><span className="method post">POST</span></td>
              <td><code>/api/mood-history</code></td>
              <td>Add a new mood check-in entry to persistent store</td>
              <td><code>&#123; "mood": "Calm", "sentimentScore": 0.5 &#125;</code></td>
            </tr>
            <tr>
              <td><span className="method get">GET</span></td>
              <td><code>/api/info</code></td>
              <td>System metadata, supervisor details, and model specifications</td>
              <td>None</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FlaskApiInfo;
