/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#2563eb",     // Blue-600 (example)
          secondary: "#9333ea",   // Purple-600
          accent: "#f59e0b",      // Optional: Amber-500
          dark: "#0f172a",        // Optional
          light: "#f8fafc",       // Optional
        },
      },
    },
    plugins: [],
  }
  