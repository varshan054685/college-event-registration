import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeatured } from '../store/slices/eventsSlice';
import EventCard from '../components/events/EventCard';
import EventSkeleton from '../components/ui/EventSkeleton';
import { fadeUp, staggerContainer, pageTransition } from '../animations/variants';

const STATS = [
  { value: '50+', label: 'Events Per Year', icon: '🎯' },
  { value: '5000+', label: 'Students Engaged', icon: '🎓' },
  { value: '20+', label: 'Clubs & Orgs', icon: '🏆' },
  { value: '100%', label: 'Free Platforms', icon: '✨' },
];

const CATEGORIES = [
  { name: 'Hackathon', icon: '💻', color: 'from-orange-500/20 to-orange-600/5' },
  { name: 'Cultural', icon: '🎭', color: 'from-rose-500/20 to-rose-600/5' },
  { name: 'Technical', icon: '⚡', color: 'from-cyan-500/20 to-cyan-600/5' },
  { name: 'Sports', icon: '🏅', color: 'from-neon/20 to-green-600/5' },
  { name: 'Workshop', icon: '🛠', color: 'from-amber-500/20 to-amber-600/5' },
  { name: 'Seminar', icon: '🎤', color: 'from-accent/20 to-purple-600/5' },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const { featured, loading } = useSelector((s) => s.events);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => { dispatch(fetchFeatured()); }, [dispatch]);

  return (
    <motion.div {...pageTransition}>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric/5 rounded-full blur-3xl pointer-events-none" />

        {/* Grid pattern */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#1e1e2e 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.4 }} />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="badge border border-accent/40 bg-accent/10 text-accent-light mb-6 inline-flex">
              🎉 &nbsp; 2025 College Events Platform
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={0.1}
            className="font-display text-5xl sm:text-6xl lg:text-8xl font-extrabold leading-none mb-6"
          >
            Your Campus.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-light via-electric to-accent-light bg-size-200 animate-pulse-slow">
              Your Events.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={0.2}
            className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Discover hackathons, cultural fests, workshops, and sports events. Register in seconds. Experience everything your college has to offer.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0.3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to={user ? "/events" : "/login"}>
              <motion.span
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px #7c3aed66' }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-8 py-4 text-base inline-flex"
              >
                Explore Events
                <span className="ml-1">→</span>
              </motion.span>
            </Link>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-6 h-10 rounded-full border-2 border-border flex items-start justify-center pt-2"
            >
              <div className="w-1.5 h-3 rounded-full bg-accent-light" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {STATS.map((s, i) => (
              <motion.div key={s.label} variants={fadeUp} custom={i * 0.1}>
                <div className="glass-card p-6 text-center hover:border-accent/40 transition-colors">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="font-display font-bold text-3xl text-text-primary mb-1">{s.value}</div>
                  <div className="text-text-muted text-sm">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex items-center justify-between mb-10">
            <div>
              <p className="text-accent-light text-sm font-mono font-medium mb-2 uppercase tracking-widest">Spotlight</p>
              <h2 className="section-title">Featured Events</h2>
            </div>
            <Link to={user ? "/events" : "/login"}>
              <motion.span whileHover={{ x: 4 }}
                className="text-accent-light text-sm font-medium flex items-center gap-1 hover:text-accent transition-colors">
                View all <span>→</span>
              </motion.span>
            </Link>
          </motion.div>

          {loading ? (
            <EventSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((event, i) => <EventCard key={event._id} event={event} index={i} user={user} />)}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mb-10 text-center">
            <p className="text-accent-light text-sm font-mono font-medium mb-2 uppercase tracking-widest">Browse By</p>
            <h2 className="section-title">Event Categories</h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.name} variants={fadeUp} initial="hidden" whileInView="visible"
                custom={i * 0.07} viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.02 }}>
                <Link to={user ? `/events?category=${cat.name}` : "/login"}
                  className={`block glass-card p-5 text-center bg-gradient-to-b ${cat.color} hover:border-accent/40 transition-all duration-300`}>
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <p className="font-display font-semibold text-sm text-text-primary">{cat.name}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="relative glass-card p-12 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-electric/10 pointer-events-none" />
              <div className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#7c3aed22 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              <div className="relative z-10">
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-4">
                  Ready to join the action?
                </h2>
                <p className="text-text-secondary mb-8 max-w-lg mx-auto">
                  Create your free account and start registering for events in under a minute.
                </p>
                {user ? (
                  <Link to="/events">
                    <motion.span
                      whileHover={{ scale: 1.05, boxShadow: '0 0 40px #7c3aed66' }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary px-10 py-4 text-base inline-flex"
                    >
                      Explore Events →
                    </motion.span>
                  </Link>
                ) : (
                  <Link to="/register">
                    <motion.span
                      whileHover={{ scale: 1.05, boxShadow: '0 0 40px #7c3aed66' }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary px-10 py-4 text-base inline-flex"
                    >
                      Sign up — It's Free ✨
                    </motion.span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
