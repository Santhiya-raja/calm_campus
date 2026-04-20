const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: String,
  domain:     { type: String, enum: ['pss', 'workload', 'sleep', 'peer'] },
  question:   String,
  answer:     { type: Number, min: 0, max: 4 },
  isReversed: { type: Boolean, default: false },
}, { _id: false });

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
  },
  answers: [answerSchema],
  scores: {
    pss:      { type: Number, min: 0, max: 40 },   // raw PSS (0-40)
    workload: { type: Number, min: 0, max: 20 },   // raw workload (0-20)
    sleep:    { type: Number, min: 0, max: 20 },   // inverted sleep stress (0-20)
    peer:     { type: Number, min: 0, max: 20 },   // raw peer (0-20)
  },
  totalScore:     { type: Number, min: 0, max: 100 },
  stressCategory: { type: String, enum: ['Low', 'Moderate', 'High', 'Severe'] },
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
