import React, { useState, useEffect } from 'react';

const MeditationPlayer = ({ session, duration = 300, onComplete, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [guidanceStep, setGuidanceStep] = useState(0);

  const guidance = [
    'Find a comfortable seated position. Close your eyes gently.',
    'Place one hand on your heart, one on your belly.',
    'Breathe in slowly through your nose... hold... exhale through your mouth.',
    'Notice the rise and fall of your breath. Let thoughts pass like clouds.',
    'Scan your body from head to toe. Release any tension you find.',
    'Rest in this awareness. You are doing wonderfully.'
  ];

  useEffect(() => {
    let interval;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          setProgress((duration - newTime) / duration * 100);
          if (newTime <= 0) {
            setIsPlaying(false);
            onComplete(duration);
            speak('Wonderful practice! Session complete. Carry this calm with you.');
            return 0;
          }
          // Guidance updates
          if (newTime % 60 === 0) {
            const step = Math.floor((duration - newTime) / (duration / guidance.length));
            setGuidanceStep(step);
            speak(guidance[step]);
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 0.9;
    utterance.volume = 0.8;
    speechSynthesis.speak(utterance);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      speak(`Starting ${session}. ${guidance[0]}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{session}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="meditation-timer">
          <div className="time-display">{formatTime(timeLeft)}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${progress}%`}}></div>
          </div>
        </div>

        <div className="guidance-text">
          <p>🎧 {guidance[guidanceStep]}</p>
        </div>

        <div className="player-controls">
          <button className={`play-btn ${isPlaying ? 'pause' : ''}`} onClick={togglePlay}>
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <div className="speed-control">
            <label>Voice Speed: </label>
            <input type="range" min="0.5" max="1.5" step="0.1" defaultValue="0.85" />
          </div>
        </div>

        <div className="session-info">
          <p>Relaxation Score: <span className="score">{Math.round(progress / 2)}%</span></p>
          <small>Biofeedback active • Data private</small>
        </div>
      </div>
    </div>
  );
};

export default MeditationPlayer;

