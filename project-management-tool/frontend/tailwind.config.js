/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      // Custom Color Palette
      colors: {
        primary: { // Use 'primary' for your main blue/teal
          50: '#ebf8ff',
          100: '#d6efff',
          200: '#b0ddff',
          300: '#84c7ff',
          400: '#57aaff',
          500: '#2f8de3', // Main brand blue
          600: '#1f6ecf',
          700: '#1552a3',
          800: '#0d3877',
          900: '#06204c',
        },
        accent: { // Use 'accent' for your warm orange/terracotta
          50: '#fff8e1',
          100: '#ffeecc',
          200: '#ffe099',
          300: '#ffd166',
          400: '#ffc333',
          500: '#ffad00', // Main accent orange
          600: '#e69a00',
          700: '#bf8000',
          800: '#996700',
          900: '#734e00',
        },
        neutral: { // Use 'neutral' for your warm grays and off-white
          50: '#fafafa', // Off-white
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161', // Ideal for body text
          800: '#424242',
          900: '#212121',
        },
      },
      // Custom Fonts
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Sets Inter as the default sans-serif font
        // You could add a custom 'heading' font if you chose a different pair:
        // heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}