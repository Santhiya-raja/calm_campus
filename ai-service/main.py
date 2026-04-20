"""
Academic Stress AI Service — FastAPI
Sentiment Analysis via DistilBERT + Rule-based Recommendation Engine
CORS enabled for ports 5000 (Node) and 5173 (React)
"""

import re
import logging
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(levelname)s  %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Academic Stress AI Service", version="1.0.0")

# ── CORS ──────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5050",   # Express API
        "http://localhost:5173",   # React Vite
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── DistilBERT model (loaded once at startup) ──────────────────────────────
sentiment_pipeline = None

@app.on_event("startup")
async def load_model():
    global sentiment_pipeline
    logger.info("📥 Loading DistilBERT sentiment model (first run downloads ~260 MB)...")
    try:
        sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english",
            return_all_scores=True,
        )
        logger.info("✅ DistilBERT model loaded and ready.")
    except Exception as e:
        logger.error(f"❌ Model load failed: {e}")

# ── Academic stressor keyword map ─────────────────────────────────────────
STRESSOR_MAP = {
    "exam_anxiety":   ["exam", "test", "quiz", "midterm", "final", "grade", "fail", "results"],
    "workload":       ["assignment", "homework", "deadline", "project", "overwhelmed", "too much", "so much work"],
    "sleep":          ["tired", "exhausted", "insomnia", "can't sleep", "sleep", "fatigue", "restless"],
    "social":         ["lonely", "isolated", "friends", "peer", "judge", "comparison", "social"],
    "financial":      ["money", "loan", "tuition", "afford", "broke", "financial"],
    "future_anxiety": ["career", "job", "future", "graduation", "internship", "GPA", "placement"],
    "family":         ["parents", "family", "home", "expectations", "disappointing"],
}

# ── Pydantic models ───────────────────────────────────────────────────────
class TextRequest(BaseModel):
    text: str

class RecommendRequest(BaseModel):
    stressScore:    float
    sentimentLabel: str
    stressors:      List[str] = []

# ── Helpers ───────────────────────────────────────────────────────────────
def detect_stressors(text: str) -> List[str]:
    t = text.lower()
    return [cat for cat, kws in STRESSOR_MAP.items() if any(kw in t for kw in kws)]

def build_summary(label: str, stressors: List[str]) -> str:
    s = ", ".join(s.replace("_", " ") for s in stressors) if stressors else "general academic pressures"
    if label == "Positive":
        return f"Your journal reflects a positive mindset despite noticing themes of {s}. Keep up your current wellbeing strategies!"
    if label == "Negative":
        return f"Your entry indicates elevated emotional stress around {s}. Consider the personalised action plan below, and remember you're not alone."
    return f"Your journal shows a balanced emotional tone with themes of {s}. Monitoring these regularly helps prevent stress build-up."

# ── Endpoints ─────────────────────────────────────────────────────────────
@app.post("/analyze")
async def analyze(request: TextRequest):
    if not request.text or len(request.text.strip()) < 3:
        raise HTTPException(status_code=400, detail="Text is too short.")

    logger.info(f"🔍 Analyzing entry ({len(request.text)} chars)...")

    sentiment_score = 0.0
    sentiment_label = "Neutral"

    if sentiment_pipeline:
        try:
            # Truncate to ~512 tokens worth of characters
            result = sentiment_pipeline(request.text[:1500])
            scores = {r["label"]: r["score"] for r in result[0]}
            pos    = scores.get("POSITIVE", 0.5)
            neg    = scores.get("NEGATIVE", 0.5)
            sentiment_score = round(pos - neg, 4)
            if sentiment_score >  0.2: sentiment_label = "Positive"
            elif sentiment_score < -0.2: sentiment_label = "Negative"
            else:                       sentiment_label = "Neutral"
            logger.info(f"✅ Sentiment → {sentiment_label}  (score={sentiment_score})")
        except Exception as e:
            logger.error(f"❌ Inference error: {e}")
    else:
        logger.warning("⚠️  Model not ready — returning Neutral fallback.")

    stressors  = detect_stressors(request.text)
    ai_summary = build_summary(sentiment_label, stressors)

    logger.info(f"   Stressors detected: {stressors}")

    return {
        "sentimentScore": sentiment_score,
        "sentimentLabel": sentiment_label,
        "stressors":      stressors,
        "aiSummary":      ai_summary,
    }

@app.post("/recommend")
async def recommend(request: RecommendRequest):
    from recommender import get_action_plan
    plan = get_action_plan(request.stressScore, request.sentimentLabel, request.stressors)
    return {"actionPlan": plan}

@app.get("/health")
async def health():
    return {
        "status":       "ok",
        "model_loaded": sentiment_pipeline is not None,
        "service":      "Academic Stress AI Service v1.0",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
