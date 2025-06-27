/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       colors: {
        primary: '#b20000',
        secondary: '#7E0000',
        background: '#bd2626',
        theadColor: '#B20000',
        titulosTabela: '4B4B4B',
        border: '#D7DBDF',
      },
    },
  },
  plugins: [],
}
