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
          50: '#f0f9fa',
          100: '#d5eff2',
          800: '#102d3f',
          900: '#0B1D2C',
          950: '#05111C',
        },
        brand: {
          blue: '#0E9AA7',
          blueHover: '#0B838F',
          teal: '#0E9AA7',
          tealDark: '#096E78',
          gold: '#F7941D',
          goldLight: '#FFAB40',
          bg: '#F5F9FA',
          textDark: '#0A1826',
          textMuted: '#5F7285',
          success: '#16803C',
          error: '#D92D20',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(14, 154, 167, 0.1)',
        'card-hover': '0 20px 40px -15px rgba(14, 154, 167, 0.15)',
        'gold-glow': '0 0 25px rgba(247, 148, 29, 0.35)',
        'teal-glow': '0 0 25px rgba(14, 154, 167, 0.35)',
      }
    },
  },
  plugins: [],
}
