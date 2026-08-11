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
          800: '#102D3F',
          900: '#0B1D2C',
          950: '#05111C',
        },
        brand: {
          teal: '#0E9AA7',
          tealDeep: '#0B838F',
          tealDark: '#086E78',
          tealLight: '#E6F7F9',
          orange: '#F7941D',
          orangeDeep: '#E67E00',
          orangeDark: '#CC7000',
          orangeLight: '#FFF3E2',
          golden: '#FFAB40',
          navy: '#05111C',
          navy900: '#0B1D2C',
          blue: '#0E9AA7',
          blueHover: '#0B838F',
          gold: '#F7941D',
          goldLight: '#FFAB40',
          bg: '#F5F9FA',
          textDark: '#0A1826',
          textMuted: '#5F7285',
          whatsapp: '#25D366',
          success: '#198754',
          successLight: '#E8F7EF',
          successText: '#146C43',
          error: '#DC3545',
          errorLight: '#FFF1F2',
          errorText: '#B42333',
          warning: '#F7941D',
          warningLight: '#FFF3E2',
          warningText: '#9A5B00',
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
        'teal-focus': '0 0 0 3px #E6F7F9',
      }
    },
  },
  plugins: [],
}
