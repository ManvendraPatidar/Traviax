/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Traviax Black & Gold Theme
        primary: '#000000',
        accent: '#D4AF37',
        'accent-bright': '#F4D03F',
        surface: '#0F0F10',
        card: '#1A1A1B',
        'text-primary': '#FFFFFF',
        'text-secondary': 'rgba(255, 255, 255, 0.8)',
        'text-muted': 'rgba(255, 255, 255, 0.6)',
        'border-light': 'rgba(255, 255, 255, 0.1)',
        'border-accent': 'rgba(212, 175, 55, 0.3)',
        success: '#28A745',
        warning: '#FFC107',
        error: '#DC3545',
        info: '#17A2B8',
        like: '#FF6B6B',
        share: '#4ECDC4',
        comment: '#45B7D1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-gold': 'pulseGold 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(212, 175, 55, 0)' },
        },
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
        'gradient-dark': 'linear-gradient(135deg, #000000 0%, #1A1A1B 100%)',
      },
    },
  },
  plugins: [],
}
