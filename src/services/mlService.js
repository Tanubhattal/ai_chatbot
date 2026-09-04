import { analyzeTextNLP } from './sentimentEngine.js';

let apiMode = 'auto'; // 'auto', 'flask', 'browser'
const FLASK_URL = 'http://localhost:5000/api';

export const setApiMode = (mode) => {
  apiMode = mode;
};

export const checkFlaskHealth = async () => {
  try {
    const res = await fetch(`${FLASK_URL}/info`, { method: 'GET', signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      return { online: true, data };
    }
  } catch (err) {
    // API unreachable
  }
  return { online: false, data: null };
};

export const analyzeSentiment = async (text) => {
  if (apiMode === 'flask' || apiMode === 'auto') {
    try {
      const res = await fetch(`${FLASK_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Fallback to client-side NLP
    }
  }
  return analyzeTextNLP(text);
};

export const sendChatMessage = async (message) => {
  if (apiMode === 'flask' || apiMode === 'auto') {
    try {
      const res = await fetch(`${FLASK_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Fallback to browser NLP engine
    }
  }
  
  const nlp = analyzeTextNLP(message);
  return {
    userMessage: message,
    aiResponse: nlp.empatheticResponse,
    sentiment: nlp.sentiment,
    emotion: nlp.emotion,
    recommendedActivity: nlp.recommendedActivity,
    crisisDetected: nlp.crisisDetected
  };
};

export const getMoodHistory = async () => {
  try {
    const res = await fetch(`${FLASK_URL}/mood-history`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      return data.history;
    }
  } catch (e) {
    // return local storage fallback
  }
  const local = localStorage.getItem('mentalWellnessMoodLogs');
  return local ? JSON.parse(local) : defaultMoodHistory;
};

export const saveMoodLog = async (logEntry) => {
  try {
    await fetch(`${FLASK_URL}/mood-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry),
      signal: AbortSignal.timeout(2000)
    });
  } catch (e) {
    // ignore
  }
  const history = await getMoodHistory();
  const updated = [logEntry, ...history];
  localStorage.setItem('mentalWellnessMoodLogs', JSON.stringify(updated));
  return updated;
};

export const defaultMoodHistory = [
  { id: 1, date: "2026-08-11", mood: "Anxious", sentimentScore: -0.4, emotion: "anxiety", note: "High workload pressure" },
  { id: 2, date: "2026-08-12", mood: "Stressed", sentimentScore: -0.5, emotion: "stress", note: "Upcoming project evaluation" },
  { id: 3, date: "2026-08-13", mood: "Neutral", sentimentScore: 0.05, emotion: "neutral", note: "Ordinary day, took a walk" },
  { id: 4, date: "2026-08-14", mood: "Calm", sentimentScore: 0.4, emotion: "happiness", note: "Practiced deep breathing" },
  { id: 5, date: "2026-08-15", mood: "Happy", sentimentScore: 0.75, emotion: "happiness", note: "Spent quality time with friends" },
  { id: 6, date: "2026-08-16", mood: "Stressed", sentimentScore: -0.3, emotion: "stress", note: "Late night study session" },
  { id: 7, date: "2026-08-17", mood: "Peaceful", sentimentScore: 0.6, emotion: "happiness", note: "Completed mental wellness check" }
];

export const initML = () => {
  console.log('AI Mental Health NLP Service initialized with dual Flask & Browser support');
};

export default {
  analyzeSentiment,
  sendChatMessage,
  getMoodHistory,
  saveMoodLog,
  checkFlaskHealth,
  setApiMode,
  initML
};
