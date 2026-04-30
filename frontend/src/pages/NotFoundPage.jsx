import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition, fadeUp } from '../animations/variants';

export default function NotFoundPage() {
  return (
    <motion.div {...pageTransition} className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
      <div className="text-center max-w-md">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-6">
          <div className="text-8xl mb-4">🔍</div>
          <h1 className="font-display font-bold text-4xl text-text-primary mb-2">Page Not Found</h1>
          <p className="text-text-muted text-lg mb-8">
            Looks like this event doesn't exist. Let's get you back on track!
          </p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1} className="flex flex-col gap-3">
          <Link to="/" className="btn-primary">← Back to Home</Link>
          <Link to="/events" className="btn-secondary">Browse Events</Link>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2}
          className="mt-12 glass-card p-6">
          <p className="text-text-muted text-sm">
            Need help? Check out our{' '}
            <a href="#" className="text-accent-light hover:text-accent transition-colors">help center</a> or
            contact{' '}
            <a href="#" className="text-accent-light hover:text-accent transition-colors">support</a>.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
