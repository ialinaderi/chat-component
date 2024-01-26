/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

export default {
  important: '[data-library="chat-component"]',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.sky["500"],
        "primary-1": colors.sky["200"],
        "primary-2": colors.sky["300"],
        "primary-3": colors.sky["600"],
        "primary-4": colors.sky["800"],
        secondary: colors.orange["600"],
        "secondary-1": colors.orange["200"],
        "secondary-2": colors.orange["300"],
        "secondary-3": colors.orange["500"],
        "secondary-4": colors.orange["800"],
        bw: {
          200: colors.neutral["200"],
          400: colors.neutral["400"],
          600: colors.neutral["600"],
          800: colors.neutral["800"],
        },
      },
      animation: {
        "fade-in-list": "fade-in-list 300ms forwards",
      },
      keyframes: {
        "fade-in-list": {
          "0%": { transform: "translateY(10px)", opacity: 0 },
          "100%": { transform: "translateY(0px)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
