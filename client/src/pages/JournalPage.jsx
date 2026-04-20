import { useState, useEffect } from 'react';
import api from '../api/axios';
import SentimentBadge from '../components/SentimentBadge';

const moods = ['😊 Great','🙂 Good','😐 Neutral','😔 Low','😰 Stressed'];

const stressorLabels = {
  exam_anxiety:   '📝 Exam Anxiety',
  workload:       '📚 Workload',
  sleep:          '😴 Sleep',
  social:         '👥 Social',
  financial:      '💰 Financial',
  future_anxiety: '🔮 Future Anxiety',
  family:         '🏠 Family',
};

export default function JournalPage() {
  const [journals,   setJournals]   = useState([]);
  const [entry,      setEntry]      = useState('');
  const [mood,       setMood]       = useState('');
  const [loading,    setLoading]    = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');

  const fetchJournals = () => {
    setLoading(true);
    api.get('/journal')
      .then(r => setJournals(r.data.journals))
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(fetchJournals, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (entry.trim().length < 10) { setError('Please write at least 10 characters.'); return; }
    setError(''); setSubmitting(true); setSuccess('');
    try {
      const { data } = await api.post('/journal', { entryText: entry, mood });
      setJournals(prev => [data.journal, ...prev]);
      setEntry(''); setMood('');
      setSuccess('✅ Journal saved! AI has analysed your entry.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save journal entry.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      <div className="bg-gradient-to-r from-secondary to-primary rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">✍️ AI Mood Journal</h1>
        <p className="opacity-90 text-sm">Write freely — our DistilBERT AI will detect your emotional tone and stress triggers.</p>
      </div>

      {/* Write form */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4">New Entry</h2>
        {error   && <div className="bg-red-50  border border-red-200  text-red-700  p-3 rounded-xl text-sm mb-3">⚠️ {error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-sm mb-3">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">How are you feeling today?</label>
            <div className="flex gap-2 flex-wrap">
              {moods.map(m => (
                <button type="button" key={m} onClick={() => setMood(m)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all duration-150
                    ${mood === m ? 'border-primary bg-primary text-white' : 'border-gray-200 hover:border-primary/50'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">What's on your mind? <span className="text-muted font-normal">(min 10 chars)</span></label>
            <textarea id="journal-entry"
              className="input-field min-h-[160px] resize-none"
              placeholder="Write about your day, how your studies are going, what's worrying you, or anything on your mind…"
              value={entry}
              onChange={e => setEntry(e.target.value)}
              maxLength={5000}
            />
            <div className="text-right text-xs text-muted mt-1">{entry.length}/5000</div>
          </div>
          <button type="submit" className="btn-green w-full" disabled={submitting}>
            {submitting
              ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analysing with AI…</span>
              : '🤖 Save & Analyse'}
          </button>
        </form>
      </div>

      {/* Past entries */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Past Entries</h2>
          <span className="text-sm text-muted">{journals.length} total</span>
        </div>
        {loading && <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}
        {!loading && journals.length === 0 && (
          <div className="text-center py-10 text-muted">
            <div className="text-4xl mb-3">📓</div>
            <p>No journal entries yet. Write your first one above!</p>
          </div>
        )}
        <div className="space-y-4">
          {journals.map(j => (
            <div key={j._id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {j.mood && <span className="text-lg">{j.mood.split(' ')[0]}</span>}
                  <SentimentBadge label={j.sentimentLabel} score={j.sentimentScore} />
                </div>
                <span className="text-xs text-muted">{new Date(j.createdAt).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' })}</span>
              </div>
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">{j.entryText}</p>
              {j.stressors?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {j.stressors.map(s => (
                    <span key={s} className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full">
                      {stressorLabels[s] || s}
                    </span>
                  ))}
                </div>
              )}
              {j.aiSummary && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
                  🤖 <strong>AI Insight:</strong> {j.aiSummary}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
