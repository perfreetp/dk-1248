/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: '#FF8A65',
        secondary: '#81C784',
        warning: '#FFD54F',
        danger: '#E57373',
        background: '#FFF8F0',
        text: '#5D4037',
        muted: '#9E9E9E'
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px'
      },
      padding: {
        'safe': 'env(safe-area-inset-bottom)'
      }
    },
  },
  plugins: [],
};
