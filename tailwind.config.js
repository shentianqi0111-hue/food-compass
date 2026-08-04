/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 这一行决定了它能不能扫描到你的 App.jsx
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}