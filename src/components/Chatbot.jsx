import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../services/mlService.js';

const Chatbot = ({ onOpenActivity }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am your AI Mental Health Companion. How are you feeling today? You can share whatever is on your mind—I am here to listen with empathy and help you process your emotions.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emotion: { dominant: 'neutral', meta: { label: 'Neutral', icon: '🤖', color: '#6366F1' } }
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(false);

  const messagesEndRef = useRef(null);

  const quickPrompts = [
    { text: "I'm feeling really anxious about my workload", icon: "😰" },
    { text: "I feel exhausted and stressed today", icon: "😤" },
    { text: "I'm feeling lonely and down", icon: "😔" },
    { text: "I had a great day today and feel hopeful!", icon: "😊" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsgId = Date.now().toString();
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const response = await sendChatMessage(query);

      // Attach sentiment badge to user message
      setMessages(prev => prev.map(m => {
        if (m.id === userMsgId) {
          return {
            ...m,
            sentiment: response.sentiment,
            emotion: response.emotion
          };
        }
        return m;
      }));

      // Check crisis detection
      if (response.crisisDetected) {
        setCrisisAlert(true);
      }

      // Add AI Response
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: response.emotion,
        activity: response.recommendedActivity
      };

      setMessages(prev => [...prev, aiMsg]);

      // Voice synthesis if enabled
      if (isSpeechEnabled && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(response.aiResponse);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Header Bar */}
      <div className="chatbot-header">
        <div className="chatbot-avatar-wrapper">
          <div className="chatbot-avatar">🤖</div>
          <div className="online-indicator"></div>
        </div>
        <div className="chatbot-title-box">
          <h3 className="chatbot-name">MindSeren AI Support</h3>
          <span className="chatbot-subtitle">NLP Sentiment-Aware Companion • Confidential</span>
        </div>
        <div className="chatbot-actions">
          <button
            className={`btn-speech-toggle ${isSpeechEnabled ? 'active' : ''}`}
            onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
            title={isSpeechEnabled ? 'Disable Voice Response' : 'Enable Voice Response'}
          >
            {isSpeechEnabled ? '🔊 Voice On' : '🔇 Voice Off'}
          </button>
        </div>
      </div>

      {/* Safety / Crisis Alert Banner */}
      {crisisAlert && (
        <div className="crisis-banner">
          <div className="crisis-icon">🚨</div>
          <div className="crisis-text">
            <strong>Need Immediate Help? You are not alone.</strong>
            <p>If you are in crisis or having thoughts of harming yourself, please call or text <strong>988</strong> (Suicide & Crisis Lifeline) or contact emergency services immediately.</p>
          </div>
          <button className="btn-close-crisis" onClick={() => setCrisisAlert(false)}>✕</button>
        </div>
      )}

      {/* Messages Feed */}
      <div className="messages-feed">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-row ${msg.sender === 'user' ? 'row-user' : 'row-ai'}`}>
            {msg.sender === 'ai' && <div className="msg-avatar">🤖</div>}

            <div className="msg-bubble-container">
              <div className={`message-bubble ${msg.sender === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
                {msg.text}

                {/* Activity Recommendation Chip inside AI message */}
                {msg.activity && (
                  <div className="chat-activity-card">
                    <div className="chat-activity-header">
                      <span>{msg.activity.icon || '🌿'}</span>
                      <strong>Recommended for You: {msg.activity.title}</strong>
                    </div>
                    <p className="chat-activity-desc">
                      {msg.activity.desc || `A ${msg.activity.duration || '3 min'} guided exercise tailored to your emotion.`}
                    </p>
                    <button
                      className="btn-start-chat-activity"
                      onClick={() => onOpenActivity && onOpenActivity(msg.activity)}
                    >
                      Start Exercise ▶
                    </button>
                  </div>
                )}
              </div>

              {/* Emotion / Sentiment Pill */}
              {msg.emotion && (
                <div className="message-meta-bar">
                  <span
                    className="emotion-pill"
                    style={{
                      backgroundColor: `${msg.emotion.meta?.color || '#6366F1'}20`,
                      borderColor: msg.emotion.meta?.color || '#6366F1',
                      color: msg.emotion.meta?.color || '#6366F1'
                    }}
                  >
                    {msg.emotion.meta?.icon || '💬'} {msg.emotion.dominant?.toUpperCase() || 'NEUTRAL'} ({msg.emotion.confidencePercent || 85}%)
                  </span>
                  <span className="msg-time">{msg.timestamp}</span>
                </div>
              )}
            </div>

            {msg.sender === 'user' && <div className="msg-avatar user-av">👤</div>}
          </div>
        ))}

        {isTyping && (
          <div className="message-row row-ai">
            <div className="msg-avatar">🤖</div>
            <div className="typing-indicator-bubble">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="quick-prompts-container">
        <span className="quick-label">Quick Prompts:</span>
        <div className="quick-chips-scroll">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              className="quick-chip"
              onClick={() => handleSend(item.text)}
            >
              <span>{item.icon}</span> {item.text}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <form
        className="chat-input-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message... (e.g. 'I am feeling overwhelmed with work')"
          className="chat-input-field"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="btn-send-message"
        >
          Send ➔
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
