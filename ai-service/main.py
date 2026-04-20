import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from textblob import TextBlob

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Academic Stress AI - Light Mode")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

@app.post("/analyze")
async def analyze(request: TextRequest):
    if not request.text:
        raise HTTPException(status_code=400, detail="Text is required.")

    # TextBlob analysis (extremely fast and light)
    analysis = TextBlob(request.text)
    sentiment_score = analysis.sentiment.polarity  # Range: -1.0 to 1.0
    
    if sentiment_score > 0.1:
        label = "Positive"
        summary = "Assessment tone: Positive. Student seems optimistic."
    elif sentiment_score < -0.1:
        label = "Negative"
        summary = "Assessment tone: Negative. Student may be experiencing high pressure."
    else:
        label = "Neutral"
        summary = "Assessment tone: Neutral. No strong emotional indicators."

    return {
        "sentimentScore": round(sentiment_score, 4),
        "sentimentLabel": label,
        "aiSummary": summary
    }

@app.get("/health")
async def health():
    return {"status": "ok", "mode": "lightweight-lexicon"}