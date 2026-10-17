/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3daec',
          300: '#95c0de',
          400: '#60a0cc',
          500: '#3c84b9',
          600: '#2b6a9c',
          700: '#23557e',
          800: '#204868',
          900: '#1e3d57',
          950: '#0e1f2d',
        },
        truck: {
          amber: '#f59e0b',
          diesel: '#0f172a',
          steel: '#334155',
          chrome: '#94a3b8',
          safety: '#ea580c',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          info: '#3b82f6',
        }
      }
    },
  },
  plugins: [],
}


