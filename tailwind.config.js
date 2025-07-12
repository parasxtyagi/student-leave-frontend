// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Agar aapki index.html file root mein hai
    "./src/**/*.{js,jsx,ts,tsx}", // Yeh line important hai aapki React components files ke liye
  ],
  theme: {
    extend: {
      // Yahan aap custom themes, colors, fonts, wagera add kar sakte hain
    },
  },
  plugins: [
    // Yahan aap Tailwind ke official plugins add kar sakte hain (optional)
  ],
}