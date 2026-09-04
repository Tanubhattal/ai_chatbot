// Advanced Client-Side NLP Sentiment & Emotion Engine for AI Mental Health Chatbot

const EMOTION_LEXICON = {
  anxiety: {
    keywords: ["anxious", "anxiety", "panic", "worried", "worry", "nervous", "scared", "overwhelmed", "dread", "uneasy", "restless", "fear", "terrified", "shaking"],
    weight: 1.2,
    color: "#3B82F6",
    label: "Anxiety",
    icon: "😰"
  },
  stress: {
    keywords: ["stressed", "stress", "burnt out", "burnout", "pressure", "exhausted", "workload", "deadline", "busy", "overworked", "frustrated", "tension", "tired"],
    weight: 1.1,
    color: "#EF4444",
    label: "Stress",
    icon: "😤"
  },
  sadness: {
    keywords: ["sad", "depressed", "lonely", "hopeless", "crying", "heartbroken", "down", "gloomy", "miserable", "grief", "empty", "hurting", "pain", "unhappy", "cry"],
    weight: 1.3,
    color: "#8B5CF6",
    label: "Sadness",
    icon: "😔"
  },
  happiness: {
    keywords: ["happy", "joy", "great", "awesome", "excited", "wonderful", "blessed", "content", "peaceful", "grateful", "good", "smiling", "loving", "fantastic", "relaxed", "calm"],
    weight: 1.0,
    color: "#10B981",
    label: "Happiness",
    icon: "😊"
  },
  anger: {
    keywords: ["angry", "mad", "furious", "hate", "irritated", "annoyed", "outraged", "enraged", "upset", "resentful", "bitter"],
    weight: 1.1,
    color: "#F59E0B",
    label: "Anger",
    icon: "🤬"
  }
};

const POSITIVE_WORDS = ["good", "great", "happy", "awesome", "excellent", "love", "wonderful", "calm", "relax", "better", "hope", "positive", "thankful", "joy", "peace", "bright", "strong"];
const NEGATIVE_WORDS = ["bad", "terrible", "sad", "anxious", "depressed", "hate", "worst", "hurt", "fail", "stress", "cry", "fear", "pain", "hopeless", "lonely", "horrible", "awful", "weak"];

const EMPATHETIC_RESPONSES = {
  anxiety: [
    "I hear how anxious and overwhelmed you're feeling right now. Take a slow, soft breath with me. You are safe in this moment.",
    "It's completely understandable to feel uneasy when things feel uncertain. Let's focus on what you can control right now.",
    "Anxiety can feel intense in the body. Remind yourself that this surge is temporary and will pass."
  ],
  stress: [
    "It sounds like you're carrying a heavy load right now. Recognizing stress is the first step toward releasing it.",
    "When pressure builds up, it's so important to give yourself permission to pause. Shall we do a quick breathing exercise?",
    "I hear how much pressure you are under. Let's break things down into smaller, manageable steps together."
  ],
  sadness: [
    "I'm so sorry you're feeling down today. Your feelings are completely valid, and it's okay to sit with this emotion for a bit.",
    "Thank you for trusting me with how you feel. You don't have to carry this sadness all by yourself.",
    "It takes courage to express when you're hurting. Please be gentle and patient with yourself today."
  ],
  happiness: [
    "It brings me so much joy to hear that! Celebrating positive moments builds lasting resilience.",
    "That's wonderful! Savoring these moments of happiness is a great way to nurture your well-being.",
    "I'm so glad you're feeling good! What contributed most to your positive mood today?"
  ],
  anger: [
    "I hear how frustrating this situation is. Anger is a natural response when boundaries or values feel crossed.",
    "It's completely okay to feel angry. Taking a pause before acting gives you power over how you respond.",
    "I'm here to listen. Let's vent safely and find a constructive way forward."
  ],
  neutral: [
    "Thank you for sharing your thoughts with me. How has your day been going overall?",
    "I'm right here with you. Is there anything specific on your mind you'd like to explore?",
    "How are you feeling in your body and mind right now? I'm here to support you."
  ]
};

const RECOMMENDATIONS = {
  anxiety: { title: "4-7-8 Grounding Breathing", category: "Breathing", duration: "3 min", icon: "💨", desc: "Regulate nervous system with rhythmic exhalations" },
  stress: { title: "Progressive Body Scan", category: "Meditation", duration: "5 min", icon: "🧘", desc: "Release tension held in your shoulders and jaw" },
  sadness: { title: "Self-Compassion & Gratitude", category: "Journaling", duration: "4 min", icon: "💖", desc: "Write gentle affirmations to nurture yourself" },
  happiness: { title: "Joy Anchoring Exercise", category: "Reframing", duration: "3 min", icon: "✨", desc: "Capture this positive state into long-term memory" },
  anger: { title: "Cooling Exhale Technique", category: "Breathing", duration: "2 min", icon: "❄️", desc: "Cool down heat and reactivity in 5 deep breaths" },
  neutral: { title: "Mindfulness Check-In", category: "Meditation", duration: "5 min", icon: "🌿", desc: "Observe thoughts with curious, non-judgmental awareness" }
};

export const analyzeTextNLP = (text) => {
  if (!text || typeof text !== 'string') text = "";
  const lowerText = text.toLowerCase();
  const words = lowerText.match(/\b\w+\b/g) || [];

  let posCount = 0;
  let negCount = 0;

  words.forEach(w => {
    if (POSITIVE_WORDS.includes(w)) posCount++;
    if (NEGATIVE_WORDS.includes(w)) negCount++;
  });

  const totalRel = posCount + negCount;
  const polarity = totalRel === 0 ? 0.0 : Number(((posCount - negCount) / totalRel).toFixed(2));

  const emotionScores = {};
  let maxScore = 0;
  let dominant = 'neutral';

  Object.keys(EMOTION_LEXICON).forEach(key => {
    let score = 0;
    EMOTION_LEXICON[key].keywords.forEach(kw => {
      if (lowerText.includes(kw)) {
        score += EMOTION_LEXICON[key].weight;
      }
    });
    emotionScores[key] = Math.round(score * 10) / 10;
    if (score > maxScore) {
      maxScore = score;
      dominant = key;
    }
  });

  if (maxScore === 0) {
    if (polarity > 0.2) dominant = 'happiness';
    else if (polarity < -0.2) dominant = 'stress';
    else dominant = 'neutral';
  }

  const confidence = Math.min(0.96, Number((0.55 + maxScore * 0.12 + Math.abs(polarity) * 0.2).toFixed(2)));

  const responses = EMPATHETIC_RESPONSES[dominant] || EMPATHETIC_RESPONSES.neutral;
  const empatheticResponse = responses[Math.floor(Math.random() * responses.length)];
  const recommendation = RECOMMENDATIONS[dominant] || RECOMMENDATIONS.neutral;

  const crisisKeywords = ["suicide", "end my life", "want to die", "self harm", "hurt myself", "hopeless nobody cares"];
  const crisisDetected = crisisKeywords.some(kw => lowerText.includes(kw));

  return {
    text,
    sentiment: {
      polarity,
      label: polarity > 0.15 ? 'Positive' : (polarity < -0.15 ? 'Negative' : 'Neutral'),
      confidence
    },
    emotion: {
      dominant,
      meta: EMOTION_LEXICON[dominant] || { label: 'Neutral', icon: '😐', color: '#64748B' },
      confidencePercent: Math.round(confidence * 100),
      scores: emotionScores
    },
    empatheticResponse,
    recommendedActivity: recommendation,
    crisisDetected,
    timestamp: new Date().toISOString()
  };
};

export default { analyzeTextNLP, EMOTION_LEXICON };
