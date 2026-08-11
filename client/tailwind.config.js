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
          50: '#e7f8fa',
          100: '#b9e6ec',
          800: '#174454',
          900: '#0A2633',
          950: '#061923',
        },
        brand: {
          blue: '#0293AC',
          blueHover: '#006F8A',
          cyan: '#0293AC',
          cyanActive: '#02A8BF',
          teal: '#018BB0',
          tealDeep: '#006F8A',
          cyanLight: '#E7F8FA',
          orange: '#FEA702',
          orangeDeep: '#FF6A00',
          gold: '#FEA702',
          goldHighlight: '#FFD000',
          navy: '#061923',
          navy900: '#0A2633',
          bg: '#F5FAFB',
          textDark: '#0A1D27',
          textMuted: '#607681',
          whatsapp: '#25D366',
          success: '#198754',
          successLight: '#E8F7EF',
          successText: '#146C43',
          error: '#DC3545',
          errorLight: '#FFF1F2',
          errorText: '#B42333',
          warning: '#FEA702',
          warningLight: '#FFF3E2',
          warningText: '#9A5B00',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(2, 147, 172, 0.1)',
        'card-hover': '0 20px 40px -15px rgba(2, 147, 172, 0.15)',
        'gold-glow': '0 0 25px rgba(254, 167, 2, 0.4)',
        'teal-glow': '0 0 25px rgba(2, 147, 172, 0.35)',
        'cyan-focus': '0 0 0 3px #E7F8FA',
      }
    },
  },
  plugins: [],
}
