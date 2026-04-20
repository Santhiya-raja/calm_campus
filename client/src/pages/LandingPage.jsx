import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon:'🧠', title:'PSS Assessment',    desc:'Scientifically validated Perceived Stress Scale plus academic-specific questions.' },
  { icon:'📊', title:'Visual Dashboard',  desc:'Beautiful trend charts showing your stress journey over time.' },
  { icon:'✍️',  title:'AI Mood Journal',   desc:'Write daily entries — our AI detects sentiment and identifies stressors.' },
  { icon:'🎯', title:'Action Plans',      desc:'Personalized YouTube-curated recommendations based on your unique profile.' },
];

const stats = [
  { value:'25', label:'Research-Backed Questions' },
  { value:'4',  label:'Stress Domains Tracked'    },
  { value:'AI', label:'DistilBERT NLP Engine'     },
];

export default function LandingPage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-hero-gradient">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-2xl text-primary">
          <span>🎓</span> CalmCampus
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="btn-primary text-sm py-2 px-5">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login"    className="btn-secondary text-sm py-2 px-5">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 pt-16 pb-20">
        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-primary border border-blue-200 mb-6 shadow-sm">
          <span className="animate-pulse-soft">🤖</span> Powered by DistilBERT AI
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
          Understand Your<br />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Academic Stress
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          A clinically-grounded assessment system for university students. Track stress, journal your moods,
          and receive AI-powered personalised recommendations — all in one calming space.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn-primary text-base py-4 px-8">
            Start Your Assessment →
          </Link>
          <Link to="/login"    className="btn-secondary text-base py-4 px-8">
            Sign In
          </Link>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-14 flex-wrap">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-primary">{s.value}</div>
              <div className="text-sm text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">Everything you need to thrive</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.title} className="card hover:shadow-glow transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16 text-center text-white px-6">
        <h2 className="text-3xl font-bold mb-4">Ready to take control of your wellbeing?</h2>
        <p className="mb-8 opacity-90">Join thousands of students managing academic stress smarter.</p>
        <Link to="/register" className="bg-white text-primary font-bold px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-200 active:scale-95 inline-block">
          Create Free Account →
        </Link>
      </section>

      <footer className="text-center py-6 text-muted text-sm">
        © 2024 CalmCampus · Academic Stress Assessment System
      </footer>
    </div>
  );
}
