import React, { useState } from 'react';

const WellnessActivities = ({ activeSession, onStartSession }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const activities = [
    {
      id: 'breathing-478',
      title: '4-7-8 Grounding Breathing',
      category: 'Breathing',
      duration: '3 min',
      targetEmotion: 'Anxiety & Overwhelm',
      icon: '💨',
      color: '#3B82F6',
      description: 'Regulate your parasympathetic nervous system with 4s inhale, 7s hold, and 8s slow exhale.',
      steps: [
        'Sit comfortably and uncross your legs.',
        'Inhale quietly through your nose for 4 seconds.',
        'Hold your breath comfortably for 7 seconds.',
        'Exhale completely through your mouth with a soft whoosh for 8 seconds.'
      ]
    },
    {
      id: 'body-scan',
      title: 'Progressive Muscle Relaxation',
      category: 'Meditation',
      duration: '5 min',
      targetEmotion: 'Stress & Tension',
      icon: '🧘',
      color: '#EF4444',
      description: 'Release physical stress trapped in your shoulders, jaw, and neck with guided tension release.',
      steps: [
        'Close your eyes and bring awareness to your shoulders.',
        'Tighten your shoulders up toward your ears for 5 seconds...',
        'Release completely and let all physical tension drop.',
        'Scan down to your hands, clench fists, and release.'
      ]
    },
    {
      id: 'cbt-reframing',
      title: 'CBT Cognitive Thought Reframing',
      category: 'Reframing',
      duration: '6 min',
      targetEmotion: 'Sadness & Negative Spiral',
      icon: '🧠',
      color: '#8B5CF6',
      description: 'Identify unhelpful cognitive distortions (catastrophizing, all-or-nothing thinking) and reframe them into balanced perspectives.',
      steps: [
        'Identify the automatic negative thought ("I cannot handle this").',
        'Ask yourself: What evidence exists that contradicts this thought?',
        'Reframe into a balanced statement: "This is difficult, but I have handled challenges before and I can take it step by step."'
      ]
    },
    {
      id: 'gratitude-flow',
      title: 'Gratitude Anchor Flow',
      category: 'Journaling',
      duration: '4 min',
      targetEmotion: 'Happiness & Peace',
      icon: '🙏',
      color: '#F59E0B',
      description: 'Deepen positive emotional states by identifying 3 distinct moments of gratitude from your day.',
      steps: [
        'Think of one small comfort you experienced today (e.g. warm drink, cozy blanket).',
        'Recall a person who supported or cared for you.',
        'Acknowledge one effort you made yourself today.'
      ]
    },
    {
      id: 'deep-sleep',
      title: 'Nighttime Wind-Down Sequence',
      category: 'Sleep',
      duration: '8 min',
      targetEmotion: 'Insomnia & Night Anxiety',
      icon: '🌙',
      color: '#6366F1',
      description: 'Prepare your mind and body for restorative rest by detaching from daily worries.',
      steps: [
        'Turn down lights and set aside all digital screens.',
        'Place one hand over your heart and breathe softly into your abdomen.',
        'Visualize placing your daily worries into a floating cloud moving far away.'
      ]
    },
    {
      id: 'cooling-exhale',
      title: 'Cooling Exhale Technique',
      category: 'Breathing',
      duration: '2 min',
      targetEmotion: 'Anger & Frustration',
      icon: '❄️',
      color: '#10B981',
      description: 'Quick cooling exhalations to reduce heat and emotional reactivity.',
      steps: [
        'Take a deep breath in through your nose.',
        'Blow out softly through pursed lips like blowing out a candle.',
        'Repeat for 5 slow cycles to restore calm reasoning.'
      ]
    }
  ];

  const categories = ['All', 'Breathing', 'Meditation', 'Reframing', 'Journaling', 'Sleep'];

  const filteredActivities = selectedCategory === 'All'
    ? activities
    : activities.filter(a => a.category === selectedCategory);

  return (
    <div className="activities-container">
      <div className="hub-header">
        <h2 className="hub-title">🧘 Empathetic Wellness & Therapeutic Interventions</h2>
        <p className="hub-subtitle">
          Evidence-based psychological exercises recommended dynamically based on sentiment analysis
        </p>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs-bar">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Activities Grid */}
      <div className="activities-grid">
        {filteredActivities.map(act => (
          <div key={act.id} className="activity-card">
            <div className="activity-header-row">
              <div className="activity-icon-badge" style={{ backgroundColor: `${act.color}20`, color: act.color }}>
                {act.icon}
              </div>
              <span className="activity-duration">{act.duration}</span>
            </div>

            <h3 className="activity-title">{act.title}</h3>
            <span className="activity-target">Target: {act.targetEmotion}</span>
            <p className="activity-desc">{act.description}</p>

            <div className="activity-footer">
              <span className="activity-category-tag">{act.category}</span>
              <button
                className="btn-start-activity"
                style={{ backgroundColor: act.color }}
                onClick={() => onStartSession(act)}
              >
                Begin Session ▶
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WellnessActivities;
