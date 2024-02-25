/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3498db', // Blue
        secondary: '#e74c3c', // Red
        accent: '#27ae60',  // Green
        background: '#f0f0f0', // Light Gray
        text: {
          black: '#000000',   // Black
          white: '#ffffff',   // White
        },
      },
    },
  },
  variants: {},
  plugins: [],

}

