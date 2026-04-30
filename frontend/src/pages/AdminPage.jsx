import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, deleteEvent, createEvent, updateEvent } from '../store/slices/eventsSlice';
import { toast } from 'react-hot-toast';
import { pageTransition, fadeUp } from '../animations/variants';

const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Hackathon', 'Other'];
const STATUSES = ['upcoming', 'ongoing', 'completed', 'cancelled'];
const EMPTY_FORM = {
  title: '', description: '', shortDescription: '', category: 'Technical',
  date: '', endDate: '', venue: '', capacity: 100, price: 0,
  image: '', organizer: '', tags: '', highlights: '',
  status: 'upcoming', isFeatured: false,
};

export default function AdminPage() {
  const dispatch = useDispatch();
  const { items, loading, total } = useSelector((s) => s.events);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('events');

  useEffect(() => { dispatch(fetchEvents({ limit: 50 })); }, [dispatch]);

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [k]: val });
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (event) => {
    setEditing(event);
    setForm({
      ...EMPTY_FORM,
      ...event,
      date: event.date ? event.date.slice(0, 16) : '',
      endDate: event.endDate ? event.endDate.slice(0, 16) : '',
      tags: (event.tags || []).join(', '),
      highlights: (event.highlights || []).join('\n'),
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        capacity: Number(form.capacity),
        price: Number(form.price),
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        highlights: form.highlights ? form.highlights.split('\n').map((h) => h.trim()).filter(Boolean) : [],
      };

      if (editing) {
        await dispatch(updateEvent({ id: editing._id, data })).unwrap();
        toast.success('Event updated!');
      } else {
        await dispatch(createEvent(data)).unwrap();
        toast.success('Event created!');
      }
      setModalOpen(false);
      dispatch(fetchEvents({ limit: 50 }));
    } catch (err) {
      toast.error(err || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This will cancel all registrations.`)) return;
    try {
      await dispatch(deleteEvent(id)).unwrap();
      toast.success('Event deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <motion.div {...pageTransition} className="pt-24 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible"
          className="flex items-center justify-between mb-8">
          <div>
            <p className="text-accent-light text-sm font-mono uppercase tracking-widest mb-1">Admin Panel</p>
            <h1 className="font-display font-bold text-3xl text-text-primary">Event Management</h1>
            <p className="text-text-muted text-sm mt-1">{total} total events</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={openCreate} className="btn-primary">
            + Create Event
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Events', value: items.length, icon: '🎯' },
            { label: 'Featured', value: items.filter(e => e.isFeatured).length, icon: '⭐' },
            { label: 'Total Capacity', value: items.reduce((s, e) => s + e.capacity, 0), icon: '👥' },
            { label: 'Registrations', value: items.reduce((s, e) => s + e.registeredCount, 0), icon: '🎫' },
          ].map((s) => (
            <div key={s.label} className="glass-card p-5">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-display font-bold text-2xl text-text-primary">{s.value.toLocaleString()}</div>
              <div className="text-text-muted text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Events table */}
        {loading ? (
          <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Event', 'Category', 'Date', 'Capacity', 'Registered', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-5 py-4 text-text-muted text-xs font-mono uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((event, i) => (
                    <motion.tr key={event._id}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/50 hover:bg-white/2 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {event.image && <img src={event.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-surface" />}
                          <div>
                            <p className="font-medium text-text-primary text-sm line-clamp-1">{event.title}</p>
                            {event.isFeatured && <span className="text-accent-light text-xs">⭐ Featured</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="badge border border-border bg-surface text-text-secondary text-xs">{event.category}</span>
                      </td>
                      <td className="px-5 py-4 text-text-muted text-sm">{format(new Date(event.date), 'MMM d, yy')}</td>
                      <td className="px-5 py-4 text-text-muted text-sm">{event.capacity}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-surface rounded-full overflow-hidden">
                            <div className="h-full bg-accent rounded-full"
                              style={{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }} />
                          </div>
                          <span className="text-text-muted text-xs">{event.registeredCount}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge border text-xs ${
                          event.status === 'upcoming' ? 'border-neon/30 bg-neon/10 text-neon' :
                          event.status === 'ongoing' ? 'border-electric/30 bg-electric/10 text-electric' :
                          event.status === 'completed' ? 'border-border bg-surface text-text-muted' :
                          'border-rose/30 bg-rose/10 text-rose'
                        }`}>{event.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => openEdit(event)}
                            className="text-accent-light text-xs hover:text-accent border border-accent/20 px-3 py-1 rounded-lg hover:bg-accent/10 transition-colors">
                            Edit
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(event._id, event.title)}
                            className="text-rose text-xs hover:text-rose/80 border border-rose/20 px-3 py-1 rounded-lg hover:bg-rose/10 transition-colors">
                            Delete
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 px-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className="w-full max-w-2xl glass-card p-8 relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-text-primary">
                  {editing ? 'Edit Event' : 'Create New Event'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="btn-ghost text-text-muted">✕</button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Title *</label>
                    <input type="text" required value={form.title} onChange={set('title')} className="input" placeholder="Event title" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Short Description</label>
                    <input type="text" value={form.shortDescription} onChange={set('shortDescription')} className="input" placeholder="One-liner (max 200 chars)" maxLength={200} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Description *</label>
                    <textarea required rows={4} value={form.description} onChange={set('description')} className="input" placeholder="Full event description" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Category *</label>
                    <select required value={form.category} onChange={set('category')} className="input">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Status</label>
                    <select value={form.status} onChange={set('status')} className="input">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Start Date & Time *</label>
                    <input type="datetime-local" required value={form.date} onChange={set('date')} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">End Date & Time</label>
                    <input type="datetime-local" value={form.endDate} onChange={set('endDate')} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Venue *</label>
                    <input type="text" required value={form.venue} onChange={set('venue')} className="input" placeholder="Hall / Block / Ground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Organizer *</label>
                    <input type="text" required value={form.organizer} onChange={set('organizer')} className="input" placeholder="Club or dept. name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Capacity *</label>
                    <input type="number" required min={1} value={form.capacity} onChange={set('capacity')} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Price (₹)</label>
                    <input type="number" min={0} value={form.price} onChange={set('price')} className="input" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Image URL</label>
                    <input type="url" value={form.image} onChange={set('image')} className="input" placeholder="https://..." />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Tags (comma separated)</label>
                    <input type="text" value={form.tags} onChange={set('tags')} className="input" placeholder="AI, ML, Web Dev" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Highlights (one per line)</label>
                    <textarea rows={3} value={form.highlights} onChange={set('highlights')} className="input" placeholder="₹50,000 Prize Pool&#10;Free meals&#10;Certificate for all" />
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="featured" checked={form.isFeatured} onChange={set('isFeatured')} className="w-4 h-4 accent-violet-600" />
                    <label htmlFor="featured" className="text-sm text-text-secondary">Feature this event on homepage</label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    type="submit" disabled={saving} className="btn-primary flex-1">
                    {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Event'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
