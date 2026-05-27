/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.php',
    './blocks/**/*.php',
    './blocks/**/*.js',
    './blocks/**/*.jsx',
    './blocks/**/*.css',
    './template-parts/**/*.php',
    './resources/**/*.css',
  ],
  theme: {
    colors: {
      // Primary brand colors
      primary: '#FFF24C',
      secondary: '#3480C3',
      
      // Text colors
      'text-heading': '#13263E',
      'text-body': '#53585F',
      
      // Additional colors
      'gray-light': '#D5DADD',
      'accent-blue': '#286FB7',
      'accent-yellow': '#FDE212',
      
      // Essential colors (white, black, transparent)
      white: '#ffffff',
      black: '#000000',
      transparent: 'transparent',
    },
    fontFamily: {
      heading: ['"Noto Serif"', 'serif'],
      body: ['"Heebo"', 'sans-serif'],
    },
    fontSize: {
      // Heading sizes calculated from H1 (56px) and H2 (40px) using ~71.4% ratio
      'h1': '56px',     // 3.5rem
      'h2': '40px',     // 2.5rem
      'h3': '28px',     // 1.75rem
      'h4': '20px',     // 1.25rem
      'h5': '16px',     // 1rem
      'h6': '14px',     // 0.875rem
      
      // Standard body sizes
      'base': '16px',
      'sm': '14px',
      'xs': '12px',
      'lg': '18px',
      'xl': '20px',
    },
    extend: {
      letterSpacing: {
        'hero': '-0.74px',        // For h1 hero headings
        'heading': '-0.56px',     // For large h2 headings
        'subheading': '-0.28px',  // For medium h4 subheadings
        'body': '-0.18px',        // For body text/paragraphs
        'mission': '-0.4px',      // For mission section text
        'display': '-0.8px',      // For extra large display text
        'label': '-0.24px',       // For small labels
        'title': '-0.32px',       // For medium titles
      },
    },
  },
  plugins: [],
};
