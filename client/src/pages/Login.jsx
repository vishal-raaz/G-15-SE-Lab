import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginAPI, registerAPI } from '../services/api';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = mode === 'login'
        ? await loginAPI({ email: form.email, password: form.password })
        : await registerAPI(form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-900">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/60 via-purple-900/40 to-surface-900" />
        {/* Floating blobs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-3xl mb-8 shadow-2xl shadow-primary-500/30">
            📝
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            AI Question<br />Paper Generator
          </h2>
          <p className="text-surface-300 text-lg mb-10 leading-relaxed">
            Generate professional exam papers powered by AI in minutes. Designed for educators.
          </p>

          {/* Feature list */}
          {[
            '🤖 AI-powered question generation',
            '📄 Professional paper formatting',
            '⬇️ One-click PDF download',
            '🎯 Customise difficulty & marks',
          ].map(f => (
            <div key={f} className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-primary-400 shrink-0" />
              <p className="text-surface-300 text-sm">{f}</p>
            </div>
          ))}

          <div className="mt-10 p-4 rounded-xl border border-surface-700 bg-surface-800/50">
            <p className="text-xs text-surface-500 mb-1">SE & Design Principles Project</p>
            <p className="text-sm font-medium text-surface-300">
              Demonstrating SRP, DRY, Modularity & Separation of Concerns
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-xl">📝</div>
            <span className="text-lg font-bold text-surface-50">AI Paper Generator</span>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-surface-50 mb-1">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-surface-400 text-sm mb-6">
              {mode === 'login' ? 'Sign in to your teacher account' : 'Register a new teacher account'}
            </p>

            {error && (
              <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-surface-400 mb-1.5">Full Name</label>
                  <input
                    id="input-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Prof. John Smith"
                    required
                    className="input-field"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-surface-400 mb-1.5">Email Address</label>
                <input
                  id="input-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="teacher@college.edu"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-400 mb-1.5">Password</label>
                <input
                  id="input-password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="input-field"
                />
              </div>

              <button
                id="btn-submit-auth"
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                  </>
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-surface-500">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  id="btn-toggle-auth-mode"
                  onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); }}
                  className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                >
                  {mode === 'login' ? 'Register' : 'Sign In'}
                </button>
              </p>
            </div>

            {/* Demo hint */}
            <div className="mt-4 p-3 rounded-lg bg-surface-800 border border-surface-700">
              <p className="text-xs text-surface-500 text-center">
                💡 Demo: Register a new account to get started
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
