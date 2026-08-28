/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#070709",
        onyx: {
          900: "#0c0c10",
          800: "#121216",
          700: "#1a1a22",
        },
        gold: {
          light: "#F3E8BA",
          DEFAULT: "#D4AF37",
          dark: "#997A15",
        },
      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.15)',
        'glass-edge': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
      },
    },
  },
  plugins: [],
};