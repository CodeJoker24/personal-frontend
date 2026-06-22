/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b0d12',
        surface: '#11141b',
        border: '#1f2330',
        text: '#e6e8ee',
        muted: '#8a93a6',
        primary: '#7c5cff',
        accent: '#22d3ee',
      },
    },
  },
  plugins: [],
}
