/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        shopify: {
          50:  '#f2f8e8',
          100: '#e4f1d0',
          200: '#c8e49a',
          300: '#aad660',
          400: '#96bf48',
          500: '#7fa83a',
          600: '#668f2c',
          700: '#4d6e1f',
          800: '#344d13',
          900: '#1c2c07',
        },
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#f6f7f9',
          tertiary: '#eef0f3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-green': 'pulseGreen 2s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideIn: { '0%': { transform: 'translateX(-10px)', opacity: 0 }, '100%': { transform: 'translateX(0)', opacity: 1 } },
        pulseGreen: { '0%,100%': { boxShadow: '0 0 0 0 rgba(150,191,72,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(150,191,72,0)' } },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'modal': '0 20px 60px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}
