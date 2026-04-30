import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const NAV_LINKS = [
  { label: 'Events', to: '/events' },
  { label: 'Dashboard', to: '/dashboard', auth: true },
  { label: 'Admin', to: '/admin', admin: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((s) => s.auth);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  const visibleLinks = NAV_LINKS.filter(
    (l) => (!l.auth || token) && (!l.admin || user?.role === 'admin')
  );

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-void/80 backdrop-blur-2xl border-b border-border/50 shadow-card' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-8 h-8 rounded-lg bg-accent-gradient flex items-center justify-center shadow-glow-sm"
          >
            <span className="text-white text-sm font-bold">E</span>
          </motion.div>
          <span className="font-display font-bold text-xl text-text-primary">
            Edu<span className="text-accent-light">Fest</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {visibleLinks.map((l) => (
            <Link key={l.to} to={l.to}>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`btn-ghost text-sm ${location.pathname === l.to ? 'text-text-primary bg-white/5' : ''}`}
              >
                {l.label}
              </motion.span>
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {token ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border">
                <div className="w-6 h-6 rounded-full bg-accent-gradient flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
                </div>
                <span className="text-sm text-text-secondary font-medium">{user?.name?.split(' ')[0]}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleLogout}
                className="btn-secondary text-sm py-2"
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="btn-ghost text-sm">Login</motion.span>
              </Link>
              <Link to="/register">
                <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="btn-primary text-sm py-2">Get Started</motion.span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden btn-ghost p-2">
          <div className="w-5 flex flex-col gap-1">
            <motion.span animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 bg-text-primary rounded" />
            <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-0.5 bg-text-primary rounded" />
            <motion.span animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 bg-text-primary rounded" />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-void/95 backdrop-blur-2xl border-b border-border overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {visibleLinks.map((l) => (
                <Link key={l.to} to={l.to}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === l.to ? 'bg-accent/10 text-accent-light' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}>
                  {l.label}
                </Link>
              ))}
              <div className="mt-2 pt-2 border-t border-border flex flex-col gap-2">
                {token ? (
                  <button onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary text-sm text-center">Login</Link>
                    <Link to="/register" className="btn-primary text-sm text-center">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
