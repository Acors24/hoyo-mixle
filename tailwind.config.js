/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fill: {
          "0%": {
            opacity: 0,
            right: "100%",
          },
          "100%": {
            opacity: 1,
            right: "0",
          },
        }
      },
      animation: {
        fill: "fill 3s linear",
      },
      boxShadow: {
        glow: "0 0 10px 0 rgb(255 255 255 / 0.1)",
      }
    },
  },
  plugins: [],
}

