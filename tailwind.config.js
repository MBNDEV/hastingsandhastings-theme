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
      
      // Gray scale
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#E8EAEC',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
        'light': '#D5DADD',
      },
      
      // Additional colors
      'accent-blue': '#286FB7',
      'accent-yellow': '#FFE066',
      'accent-gold': '#FDE212',
      'accent-gold-500': '#ECC806',
      'text-muted': '#646B73',
      
      // Footer colors
      'footer-bg': '#13263E',
      'footer-text': '#FFFFFF',
      'footer-link-blue': '#599BD7',
      
      // Essential colors (white, black, transparent)
      white: '#ffffff',
      black: '#000000',
      transparent: 'transparent',
    },
    fontFamily: {
      heading: ['"Noto Serif"', 'serif'],
      body: ['"Heebo"', 'sans-serif'],
    },
    extend: {
      fontSize: {
        // Heading sizes calculated from H1 (56px) and H2 (40px) using ~71.4% ratio
        'h1': '56px',     // 3.5rem
        'h2': '40px',     // 2.5rem
        'h3': '28px',     // 1.75rem
        'h4': '20px',     // 1.25rem
        'h5': '16px',     // 1rem
        'h6': '14px',     // 0.875rem
      },
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
