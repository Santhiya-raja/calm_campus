const router = require('express').Router();
const axios = require('axios');
const Journal = require('../models/Journal');
const auth = require('../middleware/auth');

const AI_URL = process.env.AI_SERVICE_URL || 'https://calm-campus-ai.onrender.com';

// ── POST /api/journal ─────────────────────────────────────────────────────
router.post('/', auth, async (req, res) => {
  try {
    const { entryText, mood } = req.body;
    if (!entryText || entryText.trim().length < 10)
      return res.status(400).json({ message: 'Entry must be at least 10 characters.' });

    // Default fallback if AI is unavailable
    let aiData = { sentimentScore: 0, sentimentLabel: 'Neutral', stressors: [], aiSummary: 'AI analysis unavailable — service may be starting up.' };

    try {
      console.log(`🤖 Calling AI /analyze (${entryText.length} chars)...`);
      const { data } = await axios.post(`${AI_URL}/analyze`, { text: entryText }, { timeout: 30000 });
      aiData = data;
      console.log(`✅ Sentiment: ${data.sentimentLabel} | score=${data.sentimentScore} | stressors=[${data.stressors.join(', ')}]`);
    } catch (aiErr) {
      console.warn('⚠️  AI service unreachable:', aiErr.message);
    }

    const journal = await Journal.create({
      userId: req.user._id,
      entryText, mood: mood || '',
      sentimentScore: aiData.sentimentScore,
      sentimentLabel: aiData.sentimentLabel,
      stressors: aiData.stressors,
      aiSummary: aiData.aiSummary,
    });

    console.log(`✅ Journal saved [${req.user.email}]`);
    res.status(201).json({ message: 'Journal entry saved!', journal });
  } catch (err) {
    console.error('Journal error:', err.message);
    res.status(500).json({ message: 'Failed to save journal entry.', error: err.message });
  }
});

// ── GET /api/journal ──────────────────────────────────────────────────────
router.get('/', auth, async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json({ journals });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch journals.', error: err.message });
  }
});

// ── GET /api/journal/:id ──────────────────────────────────────────────────
router.get('/:id', auth, async (req, res) => {
  try {
    const journal = await Journal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!journal) return res.status(404).json({ message: 'Journal entry not found.' });
    res.json({ journal });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch journal.', error: err.message });
  }
});

module.exports = router;
