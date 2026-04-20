const router = require('express').Router();
const axios = require('axios'); // Ensure you have installed axios: npm install axios
const Assessment = require('../models/Assessment');
const auth = require('../middleware/auth');

// ── Scoring helper ────────────────────────────────────────────────────────
const computeScores = (answers) => {
  let pss = 0, workload = 0, sleep = 0, peer = 0;

  answers.forEach(({ domain, answer }) => {
    if (domain === 'pss') pss += answer;
    if (domain === 'workload') workload += answer;
    if (domain === 'sleep') sleep += (4 - answer); // invert: high quality → low stress
    if (domain === 'peer') peer += answer;
  });

  const total = Math.round(
    (pss / 40) * 40 + (workload / 20) * 20 + (sleep / 20) * 20 + (peer / 20) * 20
  );

  let category;
  if (total <= 25) category = 'Low';
  else if (total <= 50) category = 'Moderate';
  else if (total <= 75) category = 'High';
  else category = 'Severe';

  return { scores: { pss, workload, sleep, peer }, totalScore: total, stressCategory: category };
};

// ── POST /api/assessment ──────────────────────────────────────────────────
router.post('/', auth, async (req, res) => {
  try {
    const { answers, journalEntry } = req.body; // Added journalEntry from frontend

    if (!answers || !Array.isArray(answers))
      return res.status(400).json({ message: 'Answers array is required.' });

    const { scores, totalScore, stressCategory } = computeScores(answers);

    // ── AI INTEGRATION WITH FALLBACK ──
    let aiData = { sentimentLabel: "Neutral", aiSummary: "" };

    try {
      // Only call AI if a journal entry was provided
      if (journalEntry && journalEntry.length > 5) {
        const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/analyze`, {
          text: journalEntry
        }, { timeout: 4000 }); // 4 second timeout

        aiData = aiResponse.data;
      }
    } catch (aiErr) {
      console.warn('⚠️ AI Service unreachable. Using rule-based fallback.');

      // EXHIBITION BACKUP LOGIC: Generate summary based on the 25-question score
      if (stressCategory === 'High' || stressCategory === 'Severe') {
        aiData.aiSummary = "Your assessment indicates significant academic pressure. We recommend prioritizing rest and connecting with a student counselor.";
      } else {
        aiData.aiSummary = "Your stress levels appear manageable. Continue practicing your current mindfulness routines!";
      }
    }

    const assessment = await Assessment.create({
      userId: req.user._id,
      answers,
      scores,
      totalScore,
      stressCategory,
      journalEntry: journalEntry || "",
      aiSentiment: aiData.sentimentLabel,
      aiRecommendation: aiData.aiSummary
    });

    res.status(201).json({
      message: 'Assessment saved!',
      assessmentId: assessment._id,
      totalScore,
      stressCategory,
      recommendation: aiData.aiSummary
    });

  } catch (err) {
    console.error('Assessment error:', err.message);
    res.status(500).json({ message: 'Failed to save assessment.', error: err.message });
  }
});

// GET routes for history and individual IDs remain the same...
router.get('/history', auth, async (req, res) => { /* same as before */ });
router.get('/:id', auth, async (req, res) => { /* same as before */ });

module.exports = router;