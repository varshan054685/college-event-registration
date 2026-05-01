import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fadeUp } from '../../animations/variants';

const CATEGORY_COLORS = {
  Technical: 'text-electric bg-electric/10 border-electric/30',
  Cultural: 'text-rose bg-rose/10 border-rose/30',
  Sports: 'text-neon bg-neon/10 border-neon/30',
  Workshop: 'text-amber bg-amber/10 border-amber/30',
  Seminar: 'text-accent-light bg-accent/10 border-accent/30',
  Hackathon: 'text-[#f97316] bg-orange-500/10 border-orange-500/30',
  Other: 'text-text-secondary bg-surface border-border',
};

export default function EventCard({ event, index = 0, user = null }) {
  const spotsLeft = event.capacity - event.registeredCount;
  const isFull = spotsLeft <= 0;
  const isAlmostFull = spotsLeft > 0 && spotsLeft <= 10;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      custom={index * 0.07}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
    >
      <Link to={user ? `/events/${event._id}` : "/login"} className="group block h-full">
        <div className="glass-card h-full overflow-hidden hover:border-accent/40 hover:shadow-card-hover transition-all duration-500">
          {/* Image */}
          <div className="relative aspect-[16/9] overflow-hidden bg-surface">
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent/20 to-electric/10 flex items-center justify-center">
                <span className="text-4xl">🎓</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            {event.isFeatured && (
              <div className="absolute top-3 left-3">
                <span className="badge bg-accent text-white shadow-glow-sm">⭐ Featured</span>
              </div>
            )}
            <div className="absolute top-3 right-3">
              <span className={`badge border ${CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Other}`}>
                {event.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-display font-bold text-text-primary text-lg leading-tight mb-2 line-clamp-2 group-hover:text-accent-light transition-colors">
              {event.title}
            </h3>
            <p className="text-text-secondary text-sm line-clamp-2 mb-4 leading-relaxed">
              {event.shortDescription || event.description}
            </p>

            {/* Meta */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-text-muted text-xs">
                <span>📅</span>
                <span>{format(new Date(event.date), 'MMM d, yyyy • h:mm a')}</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted text-xs">
                <span>📍</span>
                <span className="truncate">{event.venue}</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted text-xs">
                <span>👤</span>
                <span>{event.organizer}</span>
              </div>
            </div>

            {/* Tags */}
            {event.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {event.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="badge bg-surface border border-border text-text-muted text-xs">{tag}</span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div>
                <p className="text-xl font-display font-bold text-text-primary">
                  {event.price === 0 ? <span className="text-neon">Free</span> : `₹${event.price}`}
                </p>
              </div>
              <div className="text-right">
                {isFull ? (
                  <span className="badge bg-rose/10 border border-rose/30 text-rose">House Full</span>
                ) : isAlmostFull ? (
                  <span className="badge bg-amber/10 border border-amber/30 text-amber">{spotsLeft} spots left</span>
                ) : (
                  <span className="badge bg-neon/10 border border-neon/30 text-neon">{spotsLeft} open</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
