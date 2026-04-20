import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import ActionPlanCard    from '../components/ActionPlanCard';
import StressBreakdownChart from '../components/StressBreakdownChart';
import { stressMeta }   from '../data/questions';
import jsPDF            from 'jspdf';
import html2canvas      from 'html2canvas';

const AI_URL = 'http://localhost:8000';

export default function ResultsPage() {
  const { id }                 = useParams();
  const [assessment, setAssessment] = useState(null);
  const [actionPlan, setActionPlan] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    api.get(`/assessment/${id}`)
      .then(async ({ data }) => {
        const a = data.assessment;
        setAssessment(a);
        // Fetch personalised action plan from AI service
        try {
          const res = await fetch(`${AI_URL}/recommend`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stressScore: a.totalScore, sentimentLabel: 'Neutral', stressors: [] }),
          });
          const r = await res.json();
          setActionPlan(r.actionPlan || []);
        } catch { /* AI offline — empty plan */ }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const downloadPDF = async () => {
    setPdfLoading(true);
    try {
      const el = reportRef.current;
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#F0F4F8' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth  = pdf.internal.pageSize.getWidth();
      const imgHeight  = (canvas.height * pageWidth) / canvas.width;
      let   y = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();
      while (y < imgHeight) {
        if (y > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -y, pageWidth, imgHeight);
        y += pageHeight;
      }
      pdf.save(`CalmCampus_StressReport_${new Date().toISOString().slice(0,10)}.pdf`);
    } finally { setPdfLoading(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!assessment) return <div className="card text-center py-12 text-muted">Assessment not found.</div>;

  const meta = stressMeta(assessment.stressCategory);
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (assessment.totalScore / 100) * circumference;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      {/* Actions */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <Link to="/dashboard" className="btn-secondary text-sm py-2">← Back to Dashboard</Link>
        <div className="flex gap-3">
          <Link to="/assessment" className="btn-primary text-sm py-2">📝 Retake Assessment</Link>
          <button onClick={downloadPDF} disabled={pdfLoading}
            className="btn-green text-sm py-2 min-w-[130px]">
            {pdfLoading
              ? <span className="flex items-center gap-1"><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating…</span>
              : '📄 Download PDF'}
          </button>
        </div>
      </div>

      <div ref={reportRef} className="space-y-6">
        {/* Score hero */}
        <div className={`card ${meta.bg} border-2`} style={{ borderColor: meta.color + '40' }}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* SVG ring */}
            <div className="flex-shrink-0">
              <svg width="140" height="140" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                <circle cx="60" cy="60" r="52" fill="none" stroke={meta.color} strokeWidth="12"
                  strokeDasharray={circumference} strokeDashoffset={offset}
                  strokeLinecap="round" transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
                <text x="60" y="54" textAnchor="middle" fontSize="24" fontWeight="800" fill={meta.color}>{assessment.totalScore}</text>
                <text x="60" y="70" textAnchor="middle" fontSize="10" fill="#718096">out of 100</text>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{meta.icon}</span>
                <h1 className="text-3xl font-extrabold text-gray-800">{assessment.stressCategory} Stress</h1>
              </div>
              <p className="text-gray-600 mb-3">{meta.message}</p>
              <p className="text-xs text-muted">Completed: {new Date(assessment.createdAt).toLocaleString('en-IN', { dateStyle:'full', timeStyle:'short' })}</p>
            </div>
          </div>
        </div>

        {/* Domain scores */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Domain Scores</h2>
            {[
              { label:'Perceived Stress (PSS)', val:assessment.scores.pss, max:40,  color:'#4A90D9', note: 'Raw score 0–40' },
              { label:'Academic Workload',      val:assessment.scores.workload, max:20, color:'#52B788', note: 'Raw score 0–20' },
              { label:'Sleep Disruption',       val:assessment.scores.sleep,   max:20, color:'#9B59B6', note: 'Inverted — higher = less sleep' },
              { label:'Peer Pressure',          val:assessment.scores.peer,    max:20, color:'#F4874B', note: 'Raw score 0–20' },
            ].map(b => (
              <div key={b.label} className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <div>
                    <span className="text-sm font-semibold text-gray-700">{b.label}</span>
                    <span className="text-xs text-muted ml-2">{b.note}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: b.color }}>{b.val}/{b.max}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{ width:`${(b.val/b.max)*100}%`, backgroundColor: b.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Stress Breakdown</h2>
            <StressBreakdownChart scores={assessment.scores} />
          </div>
        </div>

        {/* Action plan */}
        {actionPlan.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white text-xl">🎯</div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Your Personalised Action Plan</h2>
                <p className="text-sm text-muted">Curated recommendations based on your assessment score</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {actionPlan.map((item, i) => (
                <ActionPlanCard key={i} item={item} index={i} />
              ))}
            </div>
          </div>
        )}

        {actionPlan.length === 0 && (
          <div className="card text-center py-8 text-muted text-sm">
            <div className="text-3xl mb-2">🤖</div>
            <p>AI service is starting up. Reload the page in a moment to see your action plan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
