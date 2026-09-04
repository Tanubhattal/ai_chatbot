import React, { useState, useEffect } from 'react';

const Biofeedback = ({ userData, onClose }) => {
  const [metrics, setMetrics] = useState({
    heartRate: 72,
    relaxation: 65,
    focus: 78,
    breathing: 82
  });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prevMetrics => {
        const newRelaxation = 50 + Math.random() * 40;
        setHistory(h => [...h.slice(-9), newRelaxation]);
        return {
          heartRate: 60 + Math.random() * 20,
          relaxation: newRelaxation,
          focus: 60 + Math.random() * 30,
          breathing: 70 + Math.random() * 20
        };
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="biofeedback-modal" onClick={onClose}>
      <div className="biofeedback-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📊 Live Biofeedback</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        <div className="biofeedback-content">
          <p className="page-subtitle">Real-time physiological insights</p>
          
          <div className="metrics-grid">
            <div className="metric">
              <div className="metric-value">{Math.round(metrics.heartRate)}</div>
              <div className="metric-label">Heart Rate <span>bpm</span></div>
              <div className="metric-bar">
                <div className="metric-fill" style={{width: `${(metrics.heartRate - 60)/40*100}%`}}></div>
              </div>
            </div>
            
            <div className="metric">
              <div className="metric-value">{Math.round(metrics.relaxation)}%</div>
              <div className="metric-label">Relaxation</div>
              <div className="metric-bar">
                <div className={`metric-fill ${metrics.relaxation > 75 ? 'excellent' : metrics.relaxation > 60 ? 'good' : 'fair'}`} 
                     style={{width: `${metrics.relaxation}%`}}></div>
              </div>
            </div>
            
            <div className="metric">
              <div className="metric-value">{Math.round(metrics.focus)}%</div>
              <div className="metric-label">Focus</div>
              <div className="metric-bar">
                <div className="metric-fill" style={{width: `${metrics.focus}%`}}></div>
              </div>
            </div>
          </div>

          <div className="bio-trend">
            <h4>Relaxation Trend</h4>
            <div className="trend-chart">
              {history.map((val, i) => (
                <div key={i} className="trend-bar" style={{height: `${val}%`}}></div>
              ))}
            </div>
          </div>

          <div className="bio-tips">
            <p>💡 {getTip(metrics.relaxation)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const getTip = (relaxation) => {
  if (relaxation > 80) return 'Excellent! Deep meditative state achieved.';
  if (relaxation > 65) return 'Great breathing. Stay present with your breath.';
  if (relaxation > 50) return 'Good start. Try lengthening your exhales.';
  return 'Focus on slow, deep breaths from your belly.';
};

export default Biofeedback;

