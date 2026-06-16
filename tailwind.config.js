/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0B2447",
          soft: "#19376D",
          deep: "#061A33",
        },
        accent: {
          DEFAULT: "#19A7CE",
          soft: "#A5F1E9",
          deep: "#0F8AAB",
        },
        cream: {
          DEFAULT: "#F8F4E1",
          paper: "#FBF8EE",
        },
        ink: "#1A1A1A",
        mute: "#666666",
        soft: "#999999",
        line: "#D6CEB0",
        border: "#E5DDC4",
      },
      fontFamily: {
        display: ['Fraunces', 'Noto Serif SC', 'Georgia', 'serif'],
        sans: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        cn: ['Noto Sans SC', 'Inter', 'system-ui', 'sans-serif'],
        cnserif: ['Noto Serif SC', 'Georgia', 'serif'],
      },
      boxShadow: {
        'paper': '0 1px 0 rgba(11, 36, 71, 0.04), 0 4px 16px -4px rgba(11, 36, 71, 0.08)',
        'paper-lg': '0 2px 0 rgba(11, 36, 71, 0.04), 0 18px 40px -16px rgba(11, 36, 71, 0.18)',
        'inner-line': 'inset 0 0 0 1px #E5DDC4',
        'accent-glow': '0 8px 28px -8px rgba(25, 167, 206, 0.55)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
