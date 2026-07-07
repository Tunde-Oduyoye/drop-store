/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./drop-store-src/src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-in': 'bounceIn 0.3s ease-out',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'translate(-50%, 20px)', opacity: '0' },
          '100%': { transform: 'translate(-50%, 0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
