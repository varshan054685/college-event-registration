import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { pageTransition, fadeUp, staggerContainer } from '../animations/variants';

const STATUS_STYLE = {
  confirmed: 'bg-neon/10 text-neon border-neon/30',
  waitlisted: 'bg-amber/10 text-amber border-amber/30',
  cancelled: 'bg-rose/10 text-rose border-rose/30',
};

export default function DashboardPage() {
  const { user } = useSelector((s) => s.auth);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRegs = async () => {
    try {
      const res = await api.get('/registrations/my');
      setRegistrations(res.data);
    } catch {
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRegs(); }, []);

  const handleCancel = async (regId, eventId) => {
    try {
      await api.delete(`/registrations/${regId}`);
      setRegistrations((prev) => prev.filter((r) => r._id !== regId));
      toast.success('Registration cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const upcoming = registrations.filter((r) => new Date(r.event?.date) >= new Date() && r.status !== 'cancelled');
  const past = registrations.filter((r) => new Date(r.event?.date) < new Date());

  return (
    <motion.div {...pageTransition} className="pt-24 pb-20 px-4 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Profile header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible"
          className="glass-card p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-electric/5 pointer-events-none" />
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-accent-gradient flex items-center justify-center shadow-glow text-2xl font-display font-bold text-white">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-text-primary">{user?.name}</h1>
              <p className="text-text-muted text-sm">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                {user?.college && <span className="badge border border-border bg-surface text-text-muted text-xs">{user.college}</span>}
                {user?.year && <span className="badge border border-border bg-surface text-text-muted text-xs">{user.year} Year</span>}
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="font-display font-bold text-3xl text-accent-light">{upcoming.length}</p>
              <p className="text-text-muted text-sm">Upcoming Events</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible"
          className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Registered', value: registrations.length, icon: '🎫' },
            { label: 'Upcoming', value: upcoming.length, icon: '📅' },
            { label: 'Attended', value: past.length, icon: '✅' },
          ].map((stat) => (
            <motion.div key={stat.label} variants={fadeUp}>
              <div className="glass-card p-5 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="font-display font-bold text-2xl text-text-primary">{stat.value}</div>
                <div className="text-text-muted text-xs">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Upcoming registrations */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2}>
          <h2 className="font-display font-bold text-xl text-text-primary mb-4">Upcoming Events</h2>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
          ) : upcoming.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="text-5xl mb-3">🎯</div>
              <p className="font-display font-semibold text-text-primary mb-2">No upcoming events</p>
              <p className="text-text-muted text-sm mb-5">Discover and register for exciting events</p>
              <Link to="/events" className="btn-primary text-sm">Browse Events</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((reg) => reg.event && (
                <motion.div key={reg._id} whileHover={{ x: 4 }}
                  className="glass-card p-5 flex items-center gap-4 hover:border-accent/40 transition-colors">
                  <img src={reg.event.image} alt={reg.event.title}
                    className="w-16 h-16 rounded-xl object-cover bg-surface shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/events/${reg.event._id}`}
                      className="font-display font-semibold text-text-primary hover:text-accent-light transition-colors line-clamp-1">
                      {reg.event.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-text-muted text-xs">📅 {format(new Date(reg.event.date), 'MMM d, yyyy')}</span>
                      <span className="text-text-muted text-xs">📍 {reg.event.venue}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`badge border ${STATUS_STYLE[reg.status]}`}>{reg.status}</span>
                    <button onClick={() => handleCancel(reg._id, reg.event._id)}
                      className="text-rose text-xs hover:text-rose/80 transition-colors">Cancel</button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Past events */}
        {past.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.3} className="mt-10">
            <h2 className="font-display font-bold text-xl text-text-primary mb-4">Past Events</h2>
            <div className="space-y-3">
              {past.map((reg) => reg.event && (
                <div key={reg._id} className="glass-card p-4 flex items-center gap-4 opacity-60">
                  <img src={reg.event.image} alt={reg.event.title}
                    className="w-12 h-12 rounded-lg object-cover bg-surface shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-text-primary text-sm">{reg.event.title}</p>
                    <p className="text-text-muted text-xs">{format(new Date(reg.event.date), 'MMM d, yyyy')}</p>
                  </div>
                  <span className="badge border border-border bg-surface text-text-muted">Attended</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
