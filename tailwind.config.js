/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: "#0B0B0B",
          dark: "#0B0B0B",
          rich: "#141414",
        },
        gold: {
          DEFAULT: "#C9A227",
          light: "#E0B83F",
          muted: "#D4B853",
        },
        border: "#242424",
        text: {
          primary: "#F5F5F0",
          secondary: "#A8A8A3",
        },
        card: "#141414",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}