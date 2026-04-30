import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvent, clearCurrent } from '../store/slices/eventsSlice';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { fadeUp, pageTransition, glowPulse } from '../animations/variants';

const CATEGORY_COLORS = {
  Technical: 'text-electric border-electric/30 bg-electric/10',
  Cultural: 'text-rose border-rose/30 bg-rose/10',
  Sports: 'text-neon border-neon/30 bg-neon/10',
  Workshop: 'text-amber border-amber/30 bg-amber/10',
  Seminar: 'text-accent-light border-accent/30 bg-accent/10',
  Hackathon: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
};

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current: event, loading } = useSelector((s) => s.events);
  const { user, token } = useSelector((s) => s.auth);

  const [registered, setRegistered] = useState(false);
  const [registrationId, setRegistrationId] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    dispatch(fetchEvent(id));
    return () => dispatch(clearCurrent());
  }, [id, dispatch]);

  useEffect(() => {
    if (token) {
      api.get(`/registrations/check/${id}`)
        .then((res) => {
          setRegistered(res.data.registered);
          setRegistrationId(res.data.registration?._id);
        })
        .catch(() => {});
    }
  }, [id, token]);

  const handleRegister = async () => {
    if (!token) { navigate('/login', { state: { from: { pathname: `/events/${id}` } } }); return; }
    setRegistering(true);
    try {
      const res = await api.post('/registrations', { eventId: id });
      setRegistered(true);
      setRegistrationId(res.data._id);
      toast.success(`🎉 Registered! Ticket: ${res.data.ticketId}`);
      dispatch(fetchEvent(id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancel = async () => {
    if (!registrationId) return;
    setCancelling(true);
    try {
      await api.delete(`/registrations/${registrationId}`);
      setRegistered(false);
      setRegistrationId(null);
      toast.success('Registration cancelled');
      dispatch(fetchEvent(id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return (
    <div className="pt-24 px-4 max-w-5xl mx-auto animate-pulse space-y-6">
      <div className="skeleton h-80 rounded-2xl" />
      <div className="skeleton h-10 w-2/3 rounded-xl" />
      <div className="skeleton h-4 w-1/2 rounded" />
    </div>
  );

  if (!event) return (
    <div className="pt-24 text-center py-20">
      <p className="text-text-muted">Event not found.</p>
    </div>
  );

  const spotsLeft = event.capacity - event.registeredCount;
  const isFull = spotsLeft <= 0 && !registered;

  return (
    <motion.div {...pageTransition} className="pt-24 pb-20 px-4 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)}
          className="btn-ghost text-sm mb-6 flex items-center gap-1">
          ← Back to Events
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero image */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible"
              className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-surface">
              {event.image ? (
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-accent/20 to-electric/10 flex items-center justify-center text-6xl">🎓</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-void/60 to-transparent" />
              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className={`badge border ${CATEGORY_COLORS[event.category] || ''}`}>{event.category}</span>
                {event.isFeatured && <span className="badge bg-accent text-white">⭐ Featured</span>}
              </div>
            </motion.div>

            {/* Title & meta */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-text-primary mb-4 leading-tight">
                {event.title}
              </h1>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: '📅', label: 'Date', value: format(new Date(event.date), 'EEEE, MMM d yyyy') },
                  { icon: '⏰', label: 'Time', value: format(new Date(event.date), 'h:mm a') },
                  { icon: '📍', label: 'Venue', value: event.venue },
                  { icon: '👥', label: 'Organizer', value: event.organizer },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="glass-card p-3">
                    <p className="text-text-muted text-xs mb-1">{icon} {label}</p>
                    <p className="text-text-primary text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2}
              className="glass-card p-6">
              <h2 className="font-display font-bold text-xl text-text-primary mb-4">About this Event</h2>
              <p className="text-text-secondary leading-relaxed whitespace-pre-line">{event.description}</p>
            </motion.div>

            {/* Highlights */}
            {event.highlights?.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.3}
                className="glass-card p-6">
                <h2 className="font-display font-bold text-xl text-text-primary mb-4">Highlights</h2>
                <ul className="space-y-3">
                  {event.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <span className="text-accent-light mt-0.5">✦</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Tags */}
            {event.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span key={tag} className="badge border border-border bg-surface text-text-secondary">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Registration sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              variants={glowPulse} initial="initial" animate={registered ? 'animate' : 'initial'}
              className="glass-card p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-text-muted text-sm mb-1">Entry Fee</p>
                <p className="font-display font-bold text-4xl text-text-primary">
                  {event.price === 0 ? <span className="text-neon">FREE</span> : `₹${event.price}`}
                </p>
              </div>

              {/* Capacity */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-muted">Registered</span>
                  <span className="text-text-primary font-medium">{event.registeredCount} / {event.capacity}</span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      spotsLeft === 0 ? 'bg-rose' : spotsLeft <= 10 ? 'bg-amber' : 'bg-neon'
                    }`}
                  />
                </div>
                <p className="text-text-muted text-xs mt-2 text-right">
                  {spotsLeft > 0 ? `${spotsLeft} spots remaining` : 'Event is full'}
                </p>
              </div>

              {/* CTA */}
              {registered ? (
                <div className="space-y-3">
                  <div className="bg-neon/10 border border-neon/30 rounded-xl p-4 text-center">
                    <p className="text-neon font-bold text-sm">✅ You're Registered!</p>
                    <p className="text-text-muted text-xs mt-1">Check your dashboard for ticket details</p>
                  </div>
                  <button
                    onClick={handleCancel} disabled={cancelling}
                    className="btn-ghost w-full text-rose border border-rose/30 hover:bg-rose/10 text-sm py-2">
                    {cancelling ? 'Cancelling...' : 'Cancel Registration'}
                  </button>
                </div>
              ) : (
                <motion.button
                  whileHover={isFull ? {} : { scale: 1.03 }}
                  whileTap={isFull ? {} : { scale: 0.97 }}
                  onClick={handleRegister}
                  disabled={registering || isFull}
                  className={`w-full py-4 rounded-xl font-display font-bold text-base transition-all ${
                    isFull
                      ? 'bg-surface border border-border text-text-muted cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  {registering ? 'Registering...' : isFull ? 'Event Full' : token ? 'Register Now' : 'Login to Register'}
                </motion.button>
              )}

              <div className="mt-4 space-y-2">
                {[
                  { icon: '📅', text: format(new Date(event.date), 'MMM d, yyyy') },
                  { icon: '📍', text: event.venue },
                  { icon: '🎫', text: event.status.charAt(0).toUpperCase() + event.status.slice(1) },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-text-muted text-sm">
                    <span>{icon}</span><span>{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
