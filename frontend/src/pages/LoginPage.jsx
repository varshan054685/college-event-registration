import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/slices/authSlice';
import { pageTransition, fadeUp } from '../animations/variants';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, token } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const from = location.state?.from?.pathname || '/';

  useEffect(() => { if (token) navigate(from, { replace: true }); }, [token]);
  useEffect(() => () => dispatch(clearError()), [dispatch]);

  const handleSubmit = (e) => { e.preventDefault(); dispatch(login(form)); };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <motion.div {...pageTransition}
      className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
      <div className="w-full max-w-md">
        {/* Glow bg */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="relative glass-card p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-accent-gradient flex items-center justify-center shadow-glow-sm">
                <span className="text-white text-sm font-bold">E</span>
              </div>
              <span className="font-display font-bold text-xl">Edu<span className="text-accent-light">Fest</span></span>
            </Link>
            <h1 className="font-display font-bold text-2xl text-text-primary mb-1">Welcome back</h1>
            <p className="text-text-muted text-sm">Sign in to your account</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-rose/10 border border-rose/30 text-rose text-sm rounded-xl px-4 py-3 mb-6">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Email', key: 'email', type: 'email', placeholder: 'you@college.edu' },
              { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
                <input type={type} value={form[key]} onChange={set(key)} required
                  placeholder={placeholder} className="input" />
              </div>
            ))}

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-text-muted text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent-light hover:text-accent font-medium transition-colors">
                Create one free
              </Link>
            </p>
          </div>

          {/* Demo hint */}
          <div className="mt-4 p-3 bg-surface rounded-xl border border-border">
            <p className="text-text-muted text-xs text-center font-mono">
              Demo: admin@college.edu / admin123
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
