/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:  { DEFAULT: '#4A90D9', light: '#7BB3E8', dark: '#2C6FAB' },
        secondary:{ DEFAULT: '#52B788', light: '#80CBA8', dark: '#2D8A5E' },
        stress: {
          low:     '#52B788',
          moderate:'#F4C543',
          high:    '#F4874B',
          severe:  '#E05C5C',
        },
        surface:  '#FFFFFF',
        bg:       '#F0F4F8',
        muted:    '#718096',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: {
        card: '0 4px 24px rgba(74,144,217,0.10)',
        glow: '0 0 30px rgba(74,144,217,0.20)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #e8f4fd 0%, #d4ede8 50%, #e8f0fb 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,244,248,0.8) 100%)',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.7 } },
      },
    },
  },
  plugins: [],
};
