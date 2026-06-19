/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   '#060A0E',
          secondary: '#0B1117',
          tertiary:  '#111820',
          quad:      '#161F2A',
        },
        em: {
          DEFAULT: '#10B981',
          2: '#059669',
          3: '#34D399',
          4: '#6EE7B7',
        },
        txt: {
          primary:   '#F0F4F8',
          secondary: '#8A9BB0',
          muted:     '#4A5A6A',
        },
        border: {
          DEFAULT: 'rgba(16,185,129,0.12)',
          dim:     'rgba(255,255,255,0.06)',
          hover:   'rgba(16,185,129,0.30)',
        },
      },
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono:    ['SF Mono', 'Menlo', 'monospace'],
      },
      animation: {
        'shimmer':    'shimmer 3s linear infinite',
        'pulse-dot':  'pulse-dot 2s infinite',
        'fade-in':    'fadeIn .4s ease',
        'slide-up':   'slideUp .4s cubic-bezier(.25,.46,.45,.94)',
        'slide-in':   'slideIn .3s ease',
      },
      keyframes: {
        shimmer:   { '0%': { backgroundPosition: '0% center' }, '100%': { backgroundPosition: '200% center' } },
        'pulse-dot': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(16,185,129,.6)' },
          '50%':     { boxShadow: '0 0 0 6px rgba(16,185,129,0)' },
        },
        fadeIn:  { from: { opacity: 0 },              to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideIn: { from: { opacity: 0, transform: 'translateX(-20px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
      },
      backdropBlur: { xs: '4px' },
      boxShadow: {
        'em':    '0 0 40px rgba(16,185,129,.25)',
        'em-lg': '0 0 80px rgba(16,185,129,.15)',
        'card':  '0 4px 24px rgba(0,0,0,.4)',
      },
    },
  },
  plugins: [],
}






