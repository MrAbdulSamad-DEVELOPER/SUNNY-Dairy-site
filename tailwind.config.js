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
        cream: {
          50: '#FDFBF7',
          100: '#FAF6ED',
          200: '#F4ECE0',
          300: '#EAE0CF',
          400: '#DDD0BC',
        },
        forest: {
          50: '#F0F6F3',
          100: '#E1EDE7',
          200: '#B8D5C7',
          300: '#8FBDA7',
          400: '#529875',
          500: '#2E7855',
          600: '#1D6343',
          700: '#17583B',
          800: '#124B32',
          900: '#0B3322',
          950: '#061D13',
        },
        gold: {
          50: '#FEF9EE',
          100: '#FDF2D9',
          200: '#FBE2B0',
          300: '#F7D085',
          400: '#F1BE5B',
          500: '#E6AE4C',
          600: '#D59632',
          700: '#B27622',
          800: '#8F5A1E',
          900: '#75481B',
        },
        card: '#FFFDFA',
        muted: '#5A6F64',
        borderCream: '#EAE1D2',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(18, 75, 50, 0.05), 0 2px 6px -1px rgba(18, 75, 50, 0.03)',
        'card-hover': '0 12px 30px -4px rgba(18, 75, 50, 0.10), 0 4px 10px -2px rgba(18, 75, 50, 0.05)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      }
    },
  },
  plugins: [],
};
