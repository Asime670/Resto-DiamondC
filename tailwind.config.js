/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdfbf2',
          100: '#faf4db',
          200: '#f4e6b3',
          300: '#edd382',
          400: '#e5c158',
          500: '#d4af37',
          600: '#b58d24',
          700: '#916c1c',
          800: '#76561b',
          900: '#62461b',
          950: '#38250b',
        },
        dark: {
          950: '#070707',
          900: '#0b0b0b',
          850: '#121212',
          800: '#1a1a1a',
          700: '#262626',
        },
        brown: {
          950: '#120b06',
          900: '#1a120b',
          800: '#2c1e12',
          700: '#3d2b1f',
          600: '#573e2d',
        }
      },
      fontFamily: {
        serif: ['var(--font-cinzel)', 'Cormorant Garamond', 'Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', 'Montserrat', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
