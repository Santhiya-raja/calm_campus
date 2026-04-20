import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import StressTrendChart   from '../components/StressTrendChart';
import StressBreakdownChart from '../components/StressBreakdownChart';
import { stressMeta } from '../data/questions';

const ScoreRing = ({ score, category }) => {
  const meta = stressMeta(category);
  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="120" height="120" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle cx="50" cy="50" r="44" fill="none" stroke={meta.color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <text x="50" y="46" textAnchor="middle" fontSize="18" fontWeight="800" fill={meta.color}>{score}</text>
        <text x="50" y="60" textAnchor="middle" fontSize="9"  fill="#718096">/100</text>
      </svg>
      <span className={`text-sm font-bold px-3 py-1 rounded-full ${meta.badge}`}>{meta.icon} {category}</span>
    </div>
  );
};

export default function Dashboard() {
  const { user }                   = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [journals,    setJournals]    = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/assessment/history'),
      api.get('/journal'),
    ]).then(([aRes, jRes]) => {
      setAssessments(aRes.data.assessments);
      setJournals(jRes.data.journals);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const latest = assessments[0];
  const avgScore = assessments.length
    ? Math.round(assessments.reduce((s, a) => s + a.totalScore, 0) / assessments.length)
    : 0;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white shadow-glow">
        <h1 className="text-2xl font-bold">Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="opacity-90 mt-1 text-sm">{user?.university || 'Track your academic wellbeing daily'}</p>
        <div className="flex gap-3 mt-4">
          <Link to="/assessment" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold transition-all">
            📝 Take Assessment
          </Link>
          <Link to="/journal" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold transition-all">
            ✍️ Write Journal
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Assessments', value: assessments.length, icon:'📋', color:'text-primary' },
          { label:'Journal Entries', value: journals.length, icon:'📓', color:'text-secondary' },
          { label:'Avg. Stress Score', value: `${avgScore}%`, icon:'📊', color:'text-orange-500' },
          { label:'Latest Category',  value: latest?.stressCategory || '—', icon:'🏷️', color:'text-purple-500' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Latest score + breakdown */}
      {latest ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Latest Assessment</h2>
            <div className="flex items-center gap-6">
              <ScoreRing score={latest.totalScore} category={latest.stressCategory} />
              <div className="flex-1 space-y-2">
                {[
                  { label:'PSS Score',   val: latest.scores.pss,      max:40, color:'bg-primary' },
                  { label:'Workload',    val: latest.scores.workload,  max:20, color:'bg-secondary' },
                  { label:'Sleep Stress',val: latest.scores.sleep,    max:20, color:'bg-purple-400' },
                  { label:'Peer Press.', val: latest.scores.peer,     max:20, color:'bg-orange-400' },
                ].map(b => (
                  <div key={b.label}>
                    <div className="flex justify-between text-xs text-muted mb-1">
                      <span>{b.label}</span><span>{b.val}/{b.max}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${b.color} rounded-full transition-all duration-700`}
                        style={{ width: `${(b.val/b.max)*100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link to={`/results/${latest._id}`}
              className="mt-4 inline-block text-sm text-primary font-semibold hover:underline">
              View full results & action plan →
            </Link>
          </div>
          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Stress Breakdown</h2>
            <StressBreakdownChart scores={latest.scores} />
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No assessments yet</h3>
          <p className="text-muted text-sm mb-5">Take your first stress assessment to see your scores here.</p>
          <Link to="/assessment" className="btn-primary inline-block">Start Assessment →</Link>
        </div>
      )}

      {/* Stress trend */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Stress Trend Over Time</h2>
          <span className="text-xs text-muted">{assessments.length} assessments</span>
        </div>
        <StressTrendChart assessments={assessments} />
      </div>

      {/* Recent journals */}
      {journals.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Journal Entries</h2>
            <Link to="/journal" className="text-sm text-primary font-semibold hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {journals.slice(0, 3).map(j => (
              <div key={j._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-xl">{j.mood?.split(' ')[0] || '📝'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 line-clamp-2">{j.entryText}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${j.sentimentLabel === 'Positive' ? 'bg-green-100 text-green-700' :
                        j.sentimentLabel === 'Negative' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {j.sentimentLabel}
                    </span>
                    <span className="text-xs text-muted">{new Date(j.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
