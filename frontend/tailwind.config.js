/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        policia: {
          green: '#223B24',    // Verde Olivo Oficial
          gold: '#CFA050',     // Dorado Oficial (Botones/Acentos)
          dark: '#142215',     // Verde Oscuro
          light: '#F8FAF9',    // Fondo claro
          rojo: '#CE1126',     // Bandera - Rojo
          amarillo: '#FCD116', // Bandera - Amarillo
          verde: '#007A33'     // Bandera - Verde
        }
      }
    },
  },
  plugins: [],
}
