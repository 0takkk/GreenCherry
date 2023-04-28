const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      primary: '#f5cac3',
      primaryfont: '#0c0a09',
      primaryevent: '#f28482',
      secondary: '#84a59d',
      secondaryfont: '#78716c',
      bgcolor: '#fafaf9',
      itembg: '#d6d3d1',
      disabled: '#a8a29e',
      danger: '#dd4242',
      warning: '#f6bd60',
    },
    screens: {
      tablet: { max: '768px' },
      laptop: '1024px',
      laptopl: '1440px',
      desktop: '1280px',
    },
    borderRadius: {
      header: '0px 0px 40px 40px',
    },
    extend: {
      fontFamily: {
        sans: ['LINESeedRg'],
        thin: ['LINESeedTh'],
        bold: ['LINESeedBd'],
      },
      boxShadow: {
        header: '0px 4px 10px rgba(0, 0, 0, 0.1);',
      },
    },
  },
  plugins: [],
};
