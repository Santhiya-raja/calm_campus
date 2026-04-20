const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
  },
  entryText: {
    type: String,
    required: [true, 'Journal entry is required'],
    minlength: [10, 'Entry must be at least 10 characters'],
    maxlength: [5000, 'Entry cannot exceed 5000 characters'],
  },
  mood: {
    type: String,
    enum: ['😊 Great', '🙂 Good', '😐 Neutral', '😔 Low', '😰 Stressed', ''],
    default: '',
  },
  sentimentScore: { type: Number, min: -1, max: 1, default: 0 },
  sentimentLabel: { type: String, enum: ['Positive', 'Neutral', 'Negative'], default: 'Neutral' },
  stressors:      { type: [String], default: [] },
  aiSummary:      { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Journal', journalSchema);
