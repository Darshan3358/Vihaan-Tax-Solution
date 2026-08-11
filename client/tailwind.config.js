/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f2f6fa',
          100: '#e1ebd4',
          800: '#0e2942',
          900: '#0B1F33',
          950: '#061321',
        },
        brand: {
          blue: '#164E78',
          blueHover: '#123f62',
          gold: '#C9A227',
          goldLight: '#e0b838',
          bg: '#F7F8FA',
          textDark: '#172033',
          textMuted: '#667085',
          success: '#16803C',
          error: '#D92D20',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(11, 31, 51, 0.08)',
        'card-hover': '0 20px 40px -15px rgba(11, 31, 51, 0.12)',
        'gold-glow': '0 0 25px rgba(201, 162, 39, 0.3)',
      }
    },
  },
  plugins: [],
}
