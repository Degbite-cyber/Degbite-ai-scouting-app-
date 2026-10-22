/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#FDF2F4',
          100: '#FCE7EB',
          500: '#8A142A',
          600: '#6E0F21',
          700: '#540B1A',
          800: '#3D0713',
          900: '#2A040C',
          950: '#170206',
        },
        gold: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        surface: {
          950: '#0E0508',
          900: '#13080C',
          850: '#1A0D13',
          800: '#24131B',
          750: '#2C1721',
          700: '#331B26',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
