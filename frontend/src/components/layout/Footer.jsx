import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-accent-gradient flex items-center justify-center">
              <span className="text-white text-xs font-bold">E</span>
            </div>
            <span className="font-display font-bold text-lg">Edu<span className="text-accent-light">Fest</span></span>
          </div>
          <p className="text-text-muted text-sm leading-relaxed">Your campus, your events. Discover and register for amazing college experiences.</p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-text-secondary mb-3 text-sm uppercase tracking-wider">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {[['Events', '/events'], ['Login', '/login'], ['Register', '/register']].map(([label, to]) => (
              <Link key={to} to={to} className="text-text-muted hover:text-text-primary text-sm transition-colors">{label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-text-secondary mb-3 text-sm uppercase tracking-wider">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {['Technical', 'Cultural', 'Sports', 'Hackathon', 'Workshop'].map((c) => (
              <Link key={c} to={`/events?category=${c}`}
                className="badge bg-surface border border-border text-text-muted hover:border-accent/50 hover:text-text-secondary transition-colors">
                {c}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-text-muted text-xs">
        © {new Date().getFullYear()} EduFest. Built with MERN Stack.
      </div>
    </footer>
  );
}
