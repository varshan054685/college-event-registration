import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/slices/authSlice';
import { pageTransition, fadeUp } from '../animations/variants';

const YEARS = ['1st', '2nd', '3rd', '4th', 'Faculty'];

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', college: '', year: '' });
  const [localError, setLocalError] = useState('');

  useEffect(() => { if (token) navigate('/'); }, [token]);
  useEffect(() => () => dispatch(clearError()), [dispatch]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setLocalError('Passwords do not match'); return; }
    setLocalError('');
    dispatch(register({ name: form.name, email: form.email, password: form.password, college: form.college, year: form.year }));
  };

  const displayError = localError || error;

  return (
    <motion.div {...pageTransition}
      className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
      <div className="w-full max-w-md">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-electric/10 rounded-full blur-3xl" />
        </div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="relative glass-card p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-accent-gradient flex items-center justify-center shadow-glow-sm">
                <span className="text-white text-sm font-bold">E</span>
              </div>
              <span className="font-display font-bold text-xl">Edu<span className="text-accent-light">Fest</span></span>
            </Link>
            <h1 className="font-display font-bold text-2xl text-text-primary mb-1">Create your account</h1>
            <p className="text-text-muted text-sm">Join thousands of students on EduFest</p>
          </div>

          {displayError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-rose/10 border border-rose/30 text-rose text-sm rounded-xl px-4 py-3 mb-6">
              {displayError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Alex Johnson' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'you@college.edu' },
              { label: 'Password', key: 'password', type: 'password', placeholder: 'Min. 6 characters' },
              { label: 'Confirm Password', key: 'confirm', type: 'password', placeholder: 'Repeat password' },
              { label: 'College Name', key: 'college', type: 'text', placeholder: 'Tech University (optional)' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
                <input type={type} value={form[key]} onChange={set(key)}
                  required={key !== 'college'} placeholder={placeholder} className="input" />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Year of Study</label>
              <select value={form.year} onChange={set('year')} className="input">
                <option value="">Select year (optional)</option>
                {YEARS.map((y) => <option key={y} value={y}>{y} Year</option>)}
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Creating account...' : 'Create Account ✨'}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-text-muted text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-accent-light hover:text-accent font-medium transition-colors">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
