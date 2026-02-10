/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg': '#060608',
        'surface': '#111115',
        'text': '#f0f0f2',
        'text-muted': '#77777a',
        'accent': '#6c5ce7',
        'accent-light': '#a29bfe',
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin': 'spin 0.8s linear infinite',
        'scrollPulse': 'scrollPulse 2s ease-in-out infinite',
      },
      keyframes: {
        scrollPulse: {
          '0%, 100%': { opacity: '1', transform: 'scaleY(1)' },
          '50%': { opacity: '0.4', transform: 'scaleY(0.6)' },
        },
      },
    },
  },
  plugins: [],
}