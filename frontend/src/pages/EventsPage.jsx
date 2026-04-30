import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../store/slices/eventsSlice';
import EventCard from '../components/events/EventCard';
import EventSkeleton from '../components/ui/EventSkeleton';
import { fadeUp, pageTransition } from '../animations/variants';

const CATEGORIES = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Hackathon', 'Other'];

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { items, loading, total, pages, page } = useSelector((s) => s.events);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const params = { page: currentPage, limit: 9 };
    if (category && category !== 'All') params.category = category;
    if (search) params.search = search;
    dispatch(fetchEvents(params));
  }, [dispatch, category, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    const params = { page: 1, limit: 9 };
    if (category !== 'All') params.category = category;
    if (search) params.search = search;
    dispatch(fetchEvents(params));
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    setCurrentPage(1);
    if (cat !== 'All') setSearchParams({ category: cat });
    else setSearchParams({});
  };

  return (
    <motion.div {...pageTransition} className="pt-24 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="text-accent-light text-sm font-mono uppercase tracking-widest mb-3">All Events</motion.p>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={0.1}
            className="section-title text-4xl sm:text-5xl mb-4">
            Discover Events
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0.2}
            className="text-text-secondary max-w-xl mx-auto">
            {total > 0 ? `${total} events happening on campus` : 'Browse all upcoming events'}
          </motion.p>
        </div>

        {/* Search */}
        <motion.form variants={fadeUp} initial="hidden" animate="visible" custom={0.3}
          onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10 flex gap-3">
          <input
            type="text"
            placeholder="Search events, clubs, topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input flex-1"
          />
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            type="submit" className="btn-primary px-6">
            Search
          </motion.button>
        </motion.form>

        {/* Category filters */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.35}
          className="flex flex-wrap gap-2 justify-center mb-12">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => handleCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                category === cat
                  ? 'bg-accent text-white border-accent shadow-glow-sm'
                  : 'bg-card border-border text-text-secondary hover:border-accent/50 hover:text-text-primary'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        {loading ? (
          <EventSkeleton count={9} />
        ) : items.length === 0 ? (
          <motion.div variants={fadeUp} initial="hidden" animate="visible"
            className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display text-xl font-bold text-text-primary mb-2">No events found</h3>
            <p className="text-text-muted">Try a different category or search term</p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((event, i) => <EventCard key={event._id} event={event} index={i} />)}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <motion.button
                    key={p}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentPage(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                      currentPage === p
                        ? 'bg-accent text-white shadow-glow-sm'
                        : 'bg-card border border-border text-text-secondary hover:border-accent/50'
                    }`}
                  >{p}</motion.button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
