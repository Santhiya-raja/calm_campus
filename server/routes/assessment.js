const router     = require('express').Router();
const Assessment = require('../models/Assessment');
const auth       = require('../middleware/auth');

// ── Scoring helper ────────────────────────────────────────────────────────
// PSS:      raw 0-40  → weight 40/100
// Workload: raw 0-20  → weight 20/100
// Sleep:    INVERTED (4 - answer) → raw 0-20 → weight 20/100
// Peer:     raw 0-20  → weight 20/100
// Total = weighted normalised 0-100
const computeScores = (answers) => {
  let pss = 0, workload = 0, sleep = 0, peer = 0;

  answers.forEach(({ domain, answer, isReversed }) => {
    const val = isReversed ? 4 - answer : answer;
    if (domain === 'pss')      pss      += val;
    if (domain === 'workload') workload += val;
    if (domain === 'sleep')    sleep    += (4 - answer); // invert: high quality → low stress
    if (domain === 'peer')     peer     += val;
  });

  const total = Math.round(
    (pss / 40) * 40 + (workload / 20) * 20 + (sleep / 20) * 20 + (peer / 20) * 20,
  );

  let category;
  if (total <= 25)      category = 'Low';
  else if (total <= 50) category = 'Moderate';
  else if (total <= 75) category = 'High';
  else                  category = 'Severe';

  return { scores: { pss, workload, sleep, peer }, totalScore: total, stressCategory: category };
};

// ── POST /api/assessment ──────────────────────────────────────────────────
router.post('/', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers) || answers.length === 0)
      return res.status(400).json({ message: 'Answers array is required.' });

    const { scores, totalScore, stressCategory } = computeScores(answers);
    const assessment = await Assessment.create({
      userId: req.user._id, answers, scores, totalScore, stressCategory,
    });

    console.log(`✅ Assessment [${req.user.email}]: score=${totalScore} (${stressCategory})`);
    res.status(201).json({ message: 'Assessment saved!', assessmentId: assessment._id, scores, totalScore, stressCategory });
  } catch (err) {
    console.error('Assessment error:', err.message);
    res.status(500).json({ message: 'Failed to save assessment.', error: err.message });
  }
});

// ── GET /api/assessment/history ───────────────────────────────────────────
router.get('/history', auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.user._id })
      .sort({ createdAt: -1 }).limit(30).select('-answers');
    res.json({ assessments });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history.', error: err.message });
  }
});

// ── GET /api/assessment/:id ───────────────────────────────────────────────
router.get('/:id', auth, async (req, res) => {
  try {
    const assessment = await Assessment.findOne({ _id: req.params.id, userId: req.user._id });
    if (!assessment) return res.status(404).json({ message: 'Assessment not found.' });
    res.json({ assessment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch assessment.', error: err.message });
  }
});

module.exports = router;
