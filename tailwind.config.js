module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        shake: "shake 250ms infinite",
      },
      keyframes: {
        shake: {
          "10%": {
            transform: "translateX(-3%)",
          },
          "30%": {
            transform: "translateX(3%)",
          },
          "50%": {
            transform: "translateX(-5%)",
          },
          "70%": {
            transform: "translateX(-5%)",
          },
          "90%": {
            transform: "translateX(-1%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
      },
    },
  },
  plugins: [],
};
