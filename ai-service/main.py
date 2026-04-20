import logging
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(levelname)s  %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="Academic Stress AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Simplified for exhibition; update later for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model GLOBALLY with memory optimizations
logger.info("📥 Initializing Lite-Mode DistilBERT on CPU...")
try:
    sentiment_pipeline = pipeline(
        "sentiment-analysis",
        model="distilbert-base-uncased-finetuned-sst-2-english",
        device=-1, 
        model_kwargs={"low_cpu_mem_usage": True}
    )
    logger.info("✅ DistilBERT optimized for CPU loaded.")
except Exception as e:
    logger.error(f"❌ Model load failed: {e}")
    sentiment_pipeline = None

class TextRequest(BaseModel):
    text: str

@app.post("/analyze")
async def analyze(request: TextRequest):
    if not request.text or len(request.text.strip()) < 3:
        raise HTTPException(status_code=400, detail="Text is too short.")

    sentiment_label = "Neutral"
    sentiment_score = 0.0

    if sentiment_pipeline:
        # Analyze only the first 500 characters to keep RAM usage low
        result = sentiment_pipeline(request.text[:500])[0]
        label = result['label']
        score = result['score']
        
        if label == "POSITIVE":
            sentiment_score = round(score, 4)
        else:
            sentiment_score = round(-score, 4)

        if sentiment_score > 0.2: sentiment_label = "Positive"
        elif sentiment_score < -0.2: sentiment_label = "Negative"
        else: sentiment_label = "Neutral"
    
    return {
        "sentimentScore": sentiment_score,
        "sentimentLabel": sentiment_label,
        "aiSummary": f"Assessment tone: {sentiment_label}"
    }

@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": sentiment_pipeline is not None}