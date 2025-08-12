/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          neon: '#00ffff',
          magenta: '#ff00ff',
          purple: '#9b5de5',
          blue: '#00bbf9',
          green: '#00f5d4',
          yellow: '#f1c40f'
        }
      },
      boxShadow: {
        neon: '0 0 10px rgba(0,255,255,0.6), 0 0 20px rgba(255,0,255,0.4)'
      },
      backgroundImage: {
        'grid-cyber': 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)'
      },
      animation: {
        glow: 'glow 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite'
      },
      keyframes: {
        glow: {
          '0%, 100%': { textShadow: '0 0 10px #00ffff' },
          '50%': { textShadow: '0 0 20px #ff00ff' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      }
    }
  },
  plugins: []
}
