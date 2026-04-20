import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ALL_STEPS } from '../data/questions';

export default function AssessmentPage() {
  const [step,    setStep]    = useState(0);
  const [answers, setAnswers] = useState({}); // questionId -> answer value
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const navigate = useNavigate();

  const currentStep = ALL_STEPS[step];
  const totalSteps  = ALL_STEPS.length;
  const progress    = ((step) / totalSteps) * 100;

  const allAnswered = currentStep.questions.every(q => answers[q.id] !== undefined);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (!allAnswered) { setError('Please answer all questions before continuing.'); return; }
    setError('');
    if (step < totalSteps - 1) { setStep(s => s + 1); window.scrollTo(0, 0); }
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true); setError('');
    const payload = ALL_STEPS.flatMap(s =>
      s.questions.map(q => ({
        questionId: q.id,
        domain:     q.domain,
        question:   q.text,
        answer:     answers[q.id],
        isReversed: q.isReversed,
      }))
    );
    try {
      const { data } = await api.post('/assessment', { answers: payload });
      navigate(`/results/${data.assessmentId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
      setLoading(false);
    }
  };

  const domainColors = { primary: 'from-blue-400 to-primary', secondary: 'from-green-400 to-secondary' };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-800">Stress Assessment</h1>
          <span className="text-sm text-muted">Step {step + 1} of {totalSteps}</span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
        </div>
        {/* Step tabs */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {ALL_STEPS.map((s, i) => (
            <div key={s.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
              ${i === step ? 'bg-primary text-white shadow-md' :
                i < step   ? 'bg-green-100 text-green-700'    :
                             'bg-gray-100 text-gray-400'}`}>
              <span>{s.icon}</span> {s.label}
              {i < step && <span>✓</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="card mb-6">
        <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${domainColors[currentStep.color]} text-white px-4 py-2 rounded-xl text-sm font-semibold mb-5`}>
          {currentStep.icon} {currentStep.label}
        </div>

        {currentStep.label === 'Sleep Quality' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5 text-sm text-blue-700">
            ℹ️ <strong>Note:</strong> For sleep questions, higher answers (e.g., "Excellent") indicate <em>less</em> stress.
          </div>
        )}

        <div className="space-y-6">
          {currentStep.questions.map((q, qi) => (
            <div key={q.id} className="animate-slide-up" style={{ animationDelay: `${qi * 60}ms` }}>
              <p className="text-sm font-semibold text-gray-700 mb-3">
                <span className="inline-flex w-6 h-6 rounded-full bg-primary/10 text-primary text-xs items-center justify-center font-bold mr-2">
                  {qi + 1}
                </span>
                {q.text}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {q.options.map((opt, idx) => (
                  <button key={idx} onClick={() => handleAnswer(q.id, idx)}
                    className={`px-3 py-2.5 rounded-xl border-2 text-xs font-medium text-center transition-all duration-150 active:scale-95
                      ${answers[q.id] === idx
                        ? 'border-primary bg-primary text-white shadow-md'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-primary/50 hover:bg-blue-50'}`}>
                    <div className="text-base mb-0.5">{idx === 0 ? '0' : idx === 4 ? '4' : idx}</div>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button onClick={() => { setStep(s => s - 1); setError(''); window.scrollTo(0,0); }}
          disabled={step === 0} className="btn-secondary disabled:opacity-40">
          ← Previous
        </button>
        <span className="text-sm text-muted">
          {Object.keys(answers).length}/{ALL_STEPS.flatMap(s=>s.questions).length} answered
        </span>
        <button onClick={handleNext} disabled={loading}
          className={`${step === totalSteps - 1 ? 'btn-green' : 'btn-primary'} min-w-[130px]`}>
          {loading
            ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</span>
            : step === totalSteps - 1 ? '✅ Submit' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
