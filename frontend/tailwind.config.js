/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        chuppaGreen: {
          light: "#4ade80",
          DEFAULT: "#16a34a",
          dark: "#15803d",
        },
        chuppaGray: "#f3f4f6",
      },
    },
  },
  plugins: [],
};
