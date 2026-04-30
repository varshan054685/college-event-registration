/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        void: '#050508',
        surface: '#0d0d14',
        card: '#12121c',
        border: '#1e1e2e',
        accent: {
          DEFAULT: '#7c3aed',
          light: '#a855f7',
          glow: '#7c3aed33',
        },
        electric: '#06b6d4',
        neon: '#10b981',
        amber: '#f59e0b',
        rose: '#f43f5e',
        text: {
          primary: '#f0f0fa',
          secondary: '#9999bb',
          muted: '#55556a',
        },
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 50% -10%, #7c3aed22, transparent)',
        'card-gradient': 'linear-gradient(135deg, #12121c 0%, #0d0d14 100%)',
        'accent-gradient': 'linear-gradient(135deg, #7c3aed, #06b6d4)',
        'glow-gradient': 'radial-gradient(circle at center, #7c3aed44, transparent 70%)',
      },
      boxShadow: {
        glow: '0 0 30px #7c3aed44',
        'glow-sm': '0 0 15px #7c3aed33',
        card: '0 4px 24px rgba(0,0,0,0.5)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.7), 0 0 20px #7c3aed22',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};
