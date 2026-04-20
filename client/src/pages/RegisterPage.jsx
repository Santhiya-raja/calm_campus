import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const years = ['1st Year','2nd Year','3rd Year','4th Year','Graduate','PhD'];

export default function RegisterPage() {
  const [form,    setForm]    = useState({ name:'', email:'', password:'', university:'', year:'' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-extrabold text-primary">🎓 CalmCampus</Link>
          <p className="text-muted mt-2">Create your student account</p>
        </div>
        <div className="card shadow-glow">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Get started — it's free</h2>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              ⚠️ {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input id="reg-name" type="text" className="input-field" placeholder="Your full name"
                value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input id="reg-email" type="email" className="input-field" placeholder="you@university.edu"
                value={form.email} onChange={set('email')} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input id="reg-password" type="password" className="input-field" placeholder="Min 6 characters"
                value={form.password} onChange={set('password')} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">University (optional)</label>
                <input type="text" className="input-field" placeholder="Your university"
                  value={form.university} onChange={set('university')} />
              </div>
              <div>
                <label className="label">Year</label>
                <select className="input-field" value={form.year} onChange={set('year')}>
                  <option value="">Select year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <button id="reg-submit" type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account…</span> : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-muted mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
