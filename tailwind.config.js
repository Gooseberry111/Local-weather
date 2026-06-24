/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'weather-primary': '#0F172A',
        'weather-secondary': '#1E3A5F',
        'weather-accent': '#38BDF8',
      },
    },
    fontFamily: {
      Inter: ['Inter', 'sans-serif'],
    },
    container: {
      padding: '2rem',
      center: true,
    },
    screens: {
      sm: '640px',
      md: '768px',
    },
  },
  plugins: [],
}
