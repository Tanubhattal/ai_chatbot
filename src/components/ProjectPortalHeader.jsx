import React, { useState } from 'react';

const ProjectPortalHeader = ({ onOpenApp, onOpenLog }) => {
  const [activePortalTab, setActivePortalTab] = useState('Team Status');

  const portalTabs = [
    { id: 'Important Information', label: 'Important Information' },
    { id: 'Project Polling', label: 'Project Polling' },
    { id: 'Team Status', label: 'Team Status' },
    { id: 'Evaluation Status', label: 'Evaluation Status' },
    { id: 'Project File Upload', label: 'Project File Upload' }
  ];

  return (
    <div className="portal-header-wrapper">
      {/* Top Tabs Bar from Screenshot 2 */}
      <div className="portal-tabs-bar">
        {portalTabs.map(tab => (
          <button
            key={tab.id}
            className={`portal-tab-btn ${activePortalTab === tab.id ? 'active-red' : 'teal'}`}
            onClick={() => setActivePortalTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main White Content Card from Screenshot 2 */}
      <div className="portal-content-card">
        <h2 className="portal-project-title">
          Your Project: <span className="title-red">AI Mental Health support chatbot using sentiment analysis</span>
        </h2>

        <div className="portal-prereq-row">
          <span className="prereq-label">Prerequisite Skill:</span>
          <div className="prereq-tags">
            <span className="red-pill-tag">NLP A i</span>
            <span className="red-pill-tag">Mental description Python Flask</span>
            <span className="red-pill-tag">LLM API</span>
            <span className="red-pill-tag">Sentiment analysis</span>
          </div>
        </div>

        <div className="portal-meta-three-col">
          <div className="meta-col">
            <span className="meta-col-label">Verticals:</span>
            <span className="meta-col-val green-text">NLP AI Healthcare</span>
          </div>
          <div className="meta-col text-center">
            <span className="meta-col-label">Project Type:</span>
            <span className="meta-col-val green-text">Research</span>
          </div>
          <div className="meta-col text-right">
            <span className="meta-col-label">Complexity Level:</span>
            <span className="meta-col-val green-text">Intermediate</span>
          </div>
        </div>

        <div className="portal-objective-box">
          <strong className="obj-title">Project Objective:</strong>{' '}
          <span className="obj-text">
            The AI Mental Health Support Chatbot Using Sentiment Analysis is an intelligent system designed to provide emotional support by analyzing users' text messages and identifying their emotional state. Using Natural Language Processing (NLP), sentiment analysis, and emotion detection, the chatbot recognizes emotions such as stress, anxiety, sadness, and happiness, then generates empathetic and personalized responses. It also tracks mood patterns over time and recommends appropriate wellness activity
          </span>
        </div>

        <div className="portal-footer-grid">
          <div className="team-left">
            <strong>Your Team Members:</strong>
          </div>

          <div className="supervisor-right">
            <div>
              <strong>Supervisor:</strong> <span className="red-text">Prabjot Singh Bali (E16592)</span>
            </div>

            <div className="evaluation-panel-box">
              <span className="eval-label">Evaluation Panelists:</span>
              <button
                className="btn-view-interaction-log"
                onClick={() => onOpenLog ? onOpenLog() : onOpenApp && onOpenApp()}
              >
                View Interaction Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPortalHeader;
