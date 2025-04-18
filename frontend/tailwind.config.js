/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '818': '818px',
      },
      height: {
        '729': '729px',
      },
      backgroundImage: {
        'aqua-wave': 'linear-gradient(to bottom right, #07BEB8, #38CBC7, #68D8D6, #96ECE8, #C4FFF9)',
      },
      colors: {
        'blizzard': {
          DEFAULT: '#F9FFFF',
          'text': '#F9FFFF',
        },
        'enamelled-jewel': {
          DEFAULT: '#035C65',
          'text': '#035C65',
        },
        'black-mana': {
          DEFAULT: '#858585',
          'text': '#858585',
        },
        'placebo-turquoise': {
          DEFAULT: '#E8FFF8',
          'text': '#E8FFF8',
        },
        'veiling-waterfalls': {
          DEFAULT: '#D3EEFF',
          'text': '#D3EEFF',
        },
        'pastel-red': {
          DEFAULT: '#FF6962',
          'text': '#FF6962',
        },
      },
      dropShadow: {
        'title' : '0 3px 3px rgba(0, 0, 0, 0.25)',
        'navbar' : '0 1px 1px rgba(0, 0, 0, 0.25)',
      },
      boxShadow: {
        'custom' : '0 2px 2px rgba(0, 0, 0, 0.25)',
        'checkbox' : '0 1px 1px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        '10px': '10px',
      },
      fontSize: {
        '200': '200px',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
