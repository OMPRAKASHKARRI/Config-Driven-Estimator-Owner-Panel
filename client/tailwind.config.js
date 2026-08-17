/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3f6f5",
          100: "#e2e9e6",
          600: "#2f5233",
          700: "#264229",
          800: "#1d331f",
        },
      },
    },
  },
  plugins: [],
};
