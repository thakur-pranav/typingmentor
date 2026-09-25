/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,jsx}",
    "./features/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
      },
      colors: {
        nb: {
          bg:      "#fffbf0", // warm cream page background
          card:    "#ffffff", // card surface
          border:  "#0d0d0d", // all borders
          text:    "#0d0d0d", // primary text
          sub:     "#5a5a5a", // secondary/muted text
          yellow:  "#ffd60a", // primary accent
          cyan:    "#00b4d8", // secondary accent
          pink:    "#ff006e", // destructive / error accent
          green:   "#06d6a0", // success accent
          purple:  "#7b2d8b", // tertiary accent
        },
      },
      boxShadow: {
        nb:    "4px 4px 0 #0d0d0d",
        "nb-sm": "2px 2px 0 #0d0d0d",
        "nb-lg": "6px 6px 0 #0d0d0d",
      },
      keyframes: {
        caretBlink: {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0" },
        },
      },
      animation: {
        "caret-blink": "caretBlink 1s step-start infinite",
      },
    },
  },
  plugins: [],
};

export default config;
