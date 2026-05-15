/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        safety: {
          DEFAULT: '#ef4444',
          dim: 'rgba(239,68,68,0.12)',
          glow: 'rgba(239,68,68,0.35)',
        },
        direction: {
          DEFAULT: '#3b82f6',
          dim: 'rgba(59,130,246,0.12)',
          glow: 'rgba(59,130,246,0.35)',
        },
        manoeuvre: {
          DEFAULT: '#f59e0b',
          dim: 'rgba(245,158,11,0.12)',
          glow: 'rgba(245,158,11,0.35)',
        },
      },
    },
  },
  plugins: [],
}
