/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        sora: ["Sora", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        custom: "0 0.375em 0 0 var(--tw-shadow-colored)",
        "btn-active": "0 0.375em 0 -0.375em var(--tw-shadow-colored)",
      },
      keyframes: {
        "slide-x": {
          "0%": { transform: "translateX(0)" },

          "49%": { transform: "translateX(300%)" },
          "50%": { transform: "translateX(-300%)" },

          "100%": { transform: "translateX(0)" },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-x": "slide-x 500ms",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
