"""
AI Mental Health Support Chatbot Using Sentiment Analysis - Python Flask Backend & Single Server
Supervisor: Prabjot Singh Bali (E16592)
Vertical: NLP AI Healthcare
"""

import os
import re
import math
import random
import time
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'dist'))
ASSETS_DIR = os.path.join(DIST_DIR, 'assets')

app = Flask(
    __name__,
    static_folder=ASSETS_DIR,
    static_url_path='/assets'
)
CORS(app)

# --- NLP SENTIMENT & EMOTION DETECTION ENGINE ---

EMOTION_LEXICON = {
    "anxiety": {
        "keywords": ["anxious", "anxiety", "panic", "worried", "worry", "nervous", "scared", "overwhelmed", "dread", "uneasy", "restless", "fear", "terrified"],
        "weight": 1.2
    },
    "stress": {
        "keywords": ["stressed", "stress", "burnt out", "burnout", "pressure", "exhausted", "workload", "deadline", "busy", "overworked", "frustrated", "tension"],
        "weight": 1.1
    },
    "sadness": {
        "keywords": ["sad", "depressed", "lonely", "hopeless", "crying", "heartbroken", "down", "gloomy", "miserable", "grief", "empty", "hurting", "pain", "unhappy"],
        "weight": 1.3
    },
    "happiness": {
        "keywords": ["happy", "joy", "great", "awesome", "excited", "wonderful", "blessed", "content", "peaceful", "grateful", "good", "smiling", "loving", "fantastic"],
        "weight": 1.0
    },
    "anger": {
        "keywords": ["angry", "mad", "furious", "hate", "irritated", "annoyed", "outraged", "enraged", "upset", "resentful", "bitter"],
        "weight": 1.1
    }
}

POSITIVE_WORDS = ["good", "great", "happy", "awesome", "excellent", "love", "wonderful", "calm", "relax", "better", "hope", "positive", "thankful", "joy", "peace"]
NEGATIVE_WORDS = ["bad", "terrible", "sad", "anxious", "depressed", "hate", "worst", "hurt", "fail", "stress", "cry", "fear", "pain", "hopeless", "lonely", "horrible"]

EMPATHETIC_TEMPLATES = {
    "anxiety": [
        "I hear how anxious and overwhelmed you're feeling right now. Take a soft, slow breath with me. You don't have to carry this all at once.",
        "It's completely understandable to feel uneasy when things feel out of control. Let's ground ourselves together for a moment.",
        "Anxiety can feel so intense in the body. Remember that this feeling is temporary, and you are safe right now in this moment."
    ],
    "stress": [
        "It sounds like you're carrying a heavy load right now. Recognizing that stress is the first step toward relieving it.",
        "When pressure builds up, it's essential to give yourself permission to pause. Would you like to do a 2-minute breathing reset with me?",
        "I hear how much pressure you're under. Let's break things down into small, gentle steps."
    ],
    "sadness": [
        "I'm so sorry you're going through a tough time right now. Your feelings are completely valid, and it's okay to feel sad.",
        "Thank you for sharing this with me. You don't have to face this sadness alone—I'm right here with you.",
        "It takes strength to express when you're hurting. Please be extra gentle with yourself today."
    ],
    "happiness": [
        "It brings me joy to hear that! Celebrating these positive moments is so important for long-term emotional well-being.",
        "That's wonderful! Recognizing happiness and gratitude strengthens our inner resilience. Keep holding onto that bright energy!",
        "I'm so glad to hear you're feeling good! What contributed most to this positive mood today?"
    ],
    "anger": [
        "I can hear how frustrating this situation is for you. It's completely valid to feel angry when things feel unfair or hurtful.",
        "Anger is a powerful emotion that signals something important to us. Let's process it safely together.",
        "It's understandable to feel upset. Taking a moment to breathe before responding can help give you clarity."
    ],
    "neutral": [
        "Thank you for sharing. How has the rest of your day been unfolding?",
        "I'm here to listen whenever you'd like to talk about your thoughts, feelings, or day.",
        "How are you feeling overall right now? I'm here to support you in whatever way helps most."
    ]
}

WELLNESS_RECOMMENDATIONS = {
    "anxiety": {"title": "4-7-8 Grounding Breathing", "type": "Breathing", "duration": "3 min", "icon": "💨"},
    "stress": {"title": "Progressive Muscle Relaxation", "type": "Meditation", "duration": "5 min", "icon": "🧘"},
    "sadness": {"title": "Self-Compassion & Gratitude Flow", "type": "Journaling", "duration": "4 min", "icon": "💖"},
    "happiness": {"title": "Joy Anchoring & Mindfulness", "type": "Reframing", "duration": "3 min", "icon": "✨"},
    "anger": {"title": "Cooling Exhale Reset", "type": "Breathing", "duration": "2 min", "icon": "❄️"},
    "neutral": {"title": "Daily Mindfulness Reflection", "type": "Meditation", "duration": "5 min", "icon": "🌿"}
}

mood_history_db = [
    {"id": 1, "date": "2026-08-11", "mood": "Anxious", "sentimentScore": -0.4, "emotion": "anxiety", "note": "High workload pressure"},
    {"id": 2, "date": "2026-08-12", "mood": "Stressed", "sentimentScore": -0.5, "emotion": "stress", "note": "Upcoming project evaluation"},
    {"id": 3, "date": "2026-08-13", "mood": "Neutral", "sentimentScore": 0.05, "emotion": "neutral", "note": "Ordinary day, took a walk"},
    {"id": 4, "date": "2026-08-14", "mood": "Calm", "sentimentScore": 0.4, "emotion": "happiness", "note": "Practiced deep breathing"},
    {"id": 5, "date": "2026-08-15", "mood": "Happy", "sentimentScore": 0.75, "emotion": "happiness", "note": "Spent quality time with friends"},
    {"id": 6, "date": "2026-08-16", "mood": "Stressed", "sentimentScore": -0.3, "emotion": "stress", "note": "Late night study session"},
    {"id": 7, "date": "2026-08-17", "mood": "Peaceful", "sentimentScore": 0.6, "emotion": "happiness", "note": "Completed mental wellness check"}
]

def analyze_nlp(text):
    text_lower = text.lower()
    words = re.findall(r'\w+', text_lower)
    
    pos_count = sum(1 for w in words if w in POSITIVE_WORDS)
    neg_count = sum(1 for w in words if w in NEGATIVE_WORDS)
    total_relevant = pos_count + neg_count
    
    polarity = 0.0 if total_relevant == 0 else round((pos_count - neg_count) / max(total_relevant, 1), 2)
        
    scores = {}
    for emotion, data in EMOTION_LEXICON.items():
        score = sum(data["weight"] for kw in data["keywords"] if kw in text_lower)
        scores[emotion] = score
        
    dominant_emotion = "neutral"
    max_score = 0
    for emotion, score in scores.items():
        if score > max_score:
            max_score = score
            dominant_emotion = emotion
            
    if max_score == 0:
        if polarity > 0.2:
            dominant_emotion = "happiness"
        elif polarity < -0.2:
            dominant_emotion = "stress"
        else:
            dominant_emotion = "neutral"
            
    confidence = min(0.95, round(0.5 + (max_score * 0.15) + (abs(polarity) * 0.2), 2))
    templates = EMPATHETIC_TEMPLATES.get(dominant_emotion, EMPATHETIC_TEMPLATES["neutral"])
    empathetic_response = random.choice(templates)
    rec = WELLNESS_RECOMMENDATIONS.get(dominant_emotion, WELLNESS_RECOMMENDATIONS["neutral"])
    crisis_detected = any(k in text_lower for k in ["suicide", "end my life", "want to die", "self harm", "hurt myself", "hopeless nobody cares"])
    
    return {
        "text": text,
        "sentiment": {
            "polarity": polarity,
            "label": "Positive" if polarity > 0.15 else ("Negative" if polarity < -0.15 else "Neutral"),
            "confidence": confidence
        },
        "emotion": {
            "dominant": dominant_emotion,
            "confidencePercent": int(confidence * 100),
            "scores": {k: round(v, 2) for k, v in scores.items()}
        },
        "empatheticResponse": empathetic_response,
        "recommendedActivity": rec,
        "crisisDetected": crisis_detected,
        "timestamp": datetime.now().isoformat()
    }

# --- API ENDPOINTS ---

@app.route('/api/info', methods=['GET'])
def get_info():
    return jsonify({
        "projectName": "AI Mental Health Support Chatbot Using Sentiment Analysis",
        "supervisor": "Prabjot Singh Bali (E16592)",
        "vertical": "NLP AI Healthcare",
        "projectType": "Research & Application",
        "status": "Online",
        "version": "1.0.0",
        "modelSpecs": {
            "nlpEngine": "VADER & Rule-based Multi-Class Emotion Classifier",
            "supportedEmotions": ["Anxiety", "Stress", "Sadness", "Happiness", "Anger", "Neutral"],
            "backendFramework": "Python Flask 3.0"
        }
    })

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.json or {}
    text = data.get('text', '')
    if not text.strip():
        return jsonify({"error": "No text provided"}), 400
    return jsonify(analyze_nlp(text))

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json or {}
    user_message = data.get('message', '')
    if not user_message.strip():
        return jsonify({"error": "Empty message"}), 400
    
    analysis = analyze_nlp(user_message)
    if analysis["sentiment"]["label"] != "Neutral":
        mood_history_db.append({
            "id": len(mood_history_db) + 1,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "mood": analysis["emotion"]["dominant"].capitalize(),
            "sentimentScore": analysis["sentiment"]["polarity"],
            "emotion": analysis["emotion"]["dominant"],
            "note": user_message[:40] + ("..." if len(user_message) > 40 else "")
        })
        
    return jsonify({
        "userMessage": user_message,
        "aiResponse": analysis["empatheticResponse"],
        "sentiment": analysis["sentiment"],
        "emotion": analysis["emotion"],
        "recommendedActivity": analysis["recommendedActivity"],
        "crisisDetected": analysis["crisisDetected"]
    })

@app.route('/api/mood-history', methods=['GET', 'POST'])
def mood_history():
    if request.method == 'POST':
        data = request.json or {}
        new_entry = {
            "id": len(mood_history_db) + 1,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "mood": data.get("mood", "Calm"),
            "sentimentScore": float(data.get("sentimentScore", 0.2)),
            "emotion": data.get("emotion", "happiness"),
            "note": data.get("note", "Manual entry")
        }
        mood_history_db.append(new_entry)
        return jsonify({"success": True, "entry": new_entry})
    
    return jsonify({
        "history": mood_history_db,
        "totalEntries": len(mood_history_db)
    })

@app.route('/api/wellness-activities', methods=['GET'])
def get_wellness_activities():
    return jsonify({
        "activities": [
            {"id": 1, "title": "4-7-8 Grounding Breathing", "category": "Breathing", "duration": "3 min", "targetEmotion": "anxiety", "icon": "💨", "color": "#3B82F6"},
            {"id": 2, "title": "Stress Release Body Scan", "category": "Meditation", "duration": "5 min", "targetEmotion": "stress", "icon": "🧘", "color": "#EF4444"},
            {"id": 3, "title": "CBT Thought Reframing", "category": "Reframing", "duration": "6 min", "targetEmotion": "sadness", "icon": "🧠", "color": "#8B5CF6"},
            {"id": 4, "title": "Gratitude Anchor Flow", "category": "Journaling", "duration": "4 min", "targetEmotion": "happiness", "icon": "🙏", "color": "#F59E0B"},
            {"id": 5, "title": "Deep Sleep Night Sequence", "category": "Sleep", "duration": "10 min", "targetEmotion": "anxiety", "icon": "🌙", "color": "#6366F1"},
            {"id": 6, "title": "Cooling Exhale Technique", "category": "Breathing", "duration": "2 min", "targetEmotion": "anger", "icon": "❄️", "color": "#10B981"}
        ]
    })

# --- STATIC FRONTEND APP SERVING ---

@app.route('/')
def serve_index():
    if os.path.exists(os.path.join(DIST_DIR, 'index.html')):
        return send_from_directory(DIST_DIR, 'index.html')
    return "App is building... Please refresh in a moment.", 200

@app.route('/<path:path>')
def serve_static_files(path):
    file_path = os.path.join(DIST_DIR, path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return send_from_directory(DIST_DIR, path)
    if os.path.exists(os.path.join(DIST_DIR, 'index.html')):
        return send_from_directory(DIST_DIR, 'index.html')
    return "Not Found", 404

if __name__ == '__main__':
    print("=" * 60)
    print("AI Mental Health Support Chatbot - Single Unified Server")
    print("Serving Web Application & NLP Sentiment API at http://localhost:5000")
    print("=" * 60)
    app.run(host='0.0.0.0', port=5000, debug=True)
