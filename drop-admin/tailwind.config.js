/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        lime: {
          400: '#CCFF00',
          500: '#B8E600',
        },
      },
      keyframes: {
        pulse_dot: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        },
        slide_in: {
          '0%': { transform: 'translateY(-4px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        pulse_dot: 'pulse_dot 2s ease-in-out infinite',
        slide_in: 'slide_in 0.15s ease-out',
      },
    },
  },
  plugins: [],
}
