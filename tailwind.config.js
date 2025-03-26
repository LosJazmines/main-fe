/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Incluye archivos HTML y TypeScript de Angular
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
      },
      colors: {
        primary: "#588157", // Color de fondo principal
        secondary: "#a3b18a", // Color de los checkboxes y acentos,
        tertiary:'#3a5a40'
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
    },
  },
  plugins: [],
};
