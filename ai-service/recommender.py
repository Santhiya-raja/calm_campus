"""
Recommendation Engine — Rule-based action plan generator
Curated YouTube links for study tips, breathing, sleep, and wellness.
"""
from typing import List, Dict, Any

# ── Resource database ─────────────────────────────────────────────────────
RES = {
    "breathing": {
        "title":       "4-7-8 Breathing Exercise",
        "description": "A scientifically-backed breathing technique to calm anxiety within minutes.",
        "link":        "https://youtu.be/YRPh_GaiL8s",
        "duration":    "5 min", "type": "breathing",
    },
    "meditation": {
        "title":       "5-Minute Mindfulness Meditation",
        "description": "A quick guided session to reset your focus and reduce tension.",
        "link":        "https://youtu.be/inpok4MKVLM",
        "duration":    "5 min", "type": "meditation",
    },
    "study_tips": {
        "title":       "Study Smarter with the Pomodoro Method",
        "description": "Master time-blocked studying to cut overwhelm and boost productivity.",
        "link":        "https://youtu.be/mNBmG24djoY",
        "duration":    "10 min", "type": "study",
    },
    "sleep": {
        "title":       "Fix Your Sleep Schedule (Evidence-Based)",
        "description": "Proven techniques to improve sleep quality and wake up energised.",
        "link":        "https://youtu.be/nm1TxQj9IsQ",
        "duration":    "12 min", "type": "sleep",
    },
    "time_management": {
        "title":       "Time Management for Students",
        "description": "Handle your academic workload without burning out.",
        "link":        "https://youtu.be/oTugjssqOT0",
        "duration":    "8 min", "type": "productivity",
    },
    "exam_anxiety": {
        "title":       "Overcoming Exam Anxiety",
        "description": "Techniques for managing test anxiety and boosting exam-day confidence.",
        "link":        "https://youtu.be/WWloIAQpMcQ",
        "duration":    "7 min", "type": "anxiety",
    },
    "desk_yoga": {
        "title":       "10-Minute Desk Yoga for Students",
        "description": "Simple stretches to relieve tension without leaving your chair.",
        "link":        "https://youtu.be/tAUf7aajBWE",
        "duration":    "10 min", "type": "exercise",
    },
    "social": {
        "title":       "Building Meaningful Connections in College",
        "description": "Reduce social isolation and build a strong peer support network.",
        "link":        "https://youtu.be/HEaERAnIqsY",
        "duration":    "9 min", "type": "social",
    },
    "journaling": {
        "title":       "Journaling for Mental Health",
        "description": "How expressive writing helps process emotions and reduce stress.",
        "link":        "https://youtu.be/0I4xCbJjtJo",
        "duration":    "6 min", "type": "wellness",
    },
    "growth_mindset": {
        "title":       "The Power of a Growth Mindset (TED Talk)",
        "description": "Turn setbacks into stepping stones — Carol Dweck on thriving under pressure.",
        "link":        "https://youtu.be/M1CHPnZfFmU",
        "duration":    "11 min", "type": "mindset",
    },
}

COUNSELOR = {
    "title":       "🏥 Contact Student Counseling Services",
    "description": "Your stress level suggests you would benefit from professional support. University counseling is confidential, free, and effective.",
    "link":        "https://www.counseling.org/knowledge-center/mental-health-resources",
    "duration":    "Ongoing", "type": "counselor", "urgent": True,
}

# ── Action plan builder ───────────────────────────────────────────────────
def get_action_plan(score: float, sentiment: str, stressors: List[str]) -> List[Dict[str, Any]]:
    plan: List[Dict] = []

    def add(key: str, priority: str, reason: str):
        item = {**RES[key], "priority": priority, "reason": reason}
        if not any(p["title"] == item["title"] for p in plan):
            plan.append(item)

    # Always lead with a breathing exercise
    add("breathing", "high", "Immediate stress relief — use this right now")

    if score <= 25:
        add("journaling",      "medium", "Maintain your wellbeing with regular reflection")
        add("growth_mindset",  "medium", "Continue thriving with a positive mindset")
        add("desk_yoga",       "low",    "Stay active and energised")

    elif score <= 50:
        add("meditation",      "high",   "Daily practice reduces moderate stress")
        add("time_management", "high",   "Structure your schedule to reduce pressure")
        add("desk_yoga",       "medium", "Physical activity lowers cortisol levels")
        if "sleep" in stressors:
            add("sleep",       "high",   "Sleep issues detected — prioritise rest")

    elif score <= 75:
        add("meditation",      "high",   "Daily mindfulness is essential at this level")
        add("exam_anxiety",    "high",   "Manage exam and academic anxiety")
        add("sleep",           "high",   "Quality sleep is critical for recovery")
        add("time_management", "high",   "Restructure your academic schedule")
        add("study_tips",      "medium", "Study smarter, not harder")

    else:  # Severe
        plan.insert(0, {**COUNSELOR, "priority": "critical", "reason": "Your stress level requires professional support"})
        add("meditation",   "high", "Emergency stress relief")
        add("exam_anxiety", "high", "Manage severe anxiety symptoms")
        add("sleep",        "high", "Rest is non-negotiable for recovery")

    # Stressor-specific additions
    if "exam_anxiety" in stressors:  add("exam_anxiety",    "high",   "Exam anxiety detected in your journal")
    if "workload"     in stressors:  add("study_tips",      "high",   "Workload stress detected")
    if "sleep"        in stressors:  add("sleep",           "high",   "Sleep disruption detected")
    if "social"       in stressors:  add("social",          "medium", "Social stressors detected")
    if "future_anxiety" in stressors: add("growth_mindset", "medium", "Future anxiety detected")

    # Add counselor nudge for negative sentiment below severe threshold
    if sentiment == "Negative" and score < 76:
        nudge = {**COUNSELOR, "priority": "medium", "urgent": False,
                 "reason": "Your journal shows emotional distress — talking helps"}
        if not any(p["type"] == "counselor" for p in plan):
            plan.append(nudge)

    return plan[:8]  # cap at 8 cards
