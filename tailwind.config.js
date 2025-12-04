/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    // 👇 ESTA ES LA LÍNEA QUE FALTABA Y CAUSABA EL ERROR:
    "./node_modules/@coinbase/onchainkit/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};