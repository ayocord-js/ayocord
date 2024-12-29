/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        rounded: ['"Rounded Mplus 1c"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
