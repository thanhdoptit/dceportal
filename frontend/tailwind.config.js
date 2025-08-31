/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
      extend: {
        colors: {
          'vietinbank': '#E4002B',
          'vietinbank-gray': '#6B7280',
        },
      },
    },
    plugins: [],
  }
  