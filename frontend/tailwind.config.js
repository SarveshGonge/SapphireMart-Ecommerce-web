/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        body: ["'Poppins'", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#fff0f4",
          100: "#ffe0e9",
          200: "#ffc2d4",
          300: "#ff8fae",
          400: "#ff5c8a",
          500: "#ff3f6c",
          600: "#e8225a",
          700: "#c41349",
          800: "#9e0f3c",
          900: "#7a0d31",
        },
        ink: "#282c3f",
        mist: "#f5f5f6",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        heartPop: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.35)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.5s ease-out both",
        shimmer: "shimmer 1.6s infinite linear",
        heartPop: "heartPop 0.35s ease-out",
      },
    },
  },
  plugins: [],
}
