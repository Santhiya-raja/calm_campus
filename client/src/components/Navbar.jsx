import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/dashboard',  label: 'Dashboard',   icon: '📊' },
  { to: '/assessment', label: 'Assessment',  icon: '📝' },
  { to: '/journal',    label: 'Mood Journal', icon: '✍️'  },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
          <span className="text-2xl">🎓</span>
          <span className="hidden sm:block">CalmCampus</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={to} to={to}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${location.pathname === to
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-primary'}`}
            >
              <span>{icon}</span>{label}
            </Link>
          ))}
        </div>

        {/* User + logout */}
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <p className="text-xs text-muted">{user?.year || 'Student'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.[0]?.toUpperCase() || 'S'}
          </div>
          <button onClick={handleLogout}
            className="text-sm text-muted hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50">
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(o => !o)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-gray-600 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-gray-600 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-gray-600 transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {navLinks.map(({ to, label, icon }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                ${location.pathname === to ? 'bg-primary text-white' : 'text-gray-700 hover:bg-blue-50'}`}>
              {icon} {label}
            </Link>
          ))}
          <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl">
            🚪 Logout
          </button>
        </div>
      )}
    </nav>
  );
}
