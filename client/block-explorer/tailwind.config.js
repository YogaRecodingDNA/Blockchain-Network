/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      dropShadow: {
        'sm': '0 1px 1px rgba(255, 255, 255, 0.25)',
        'xl': '0 3px 3px rgba(255, 255, 255)',
      }
    },
  },
  plugins: [],
}
