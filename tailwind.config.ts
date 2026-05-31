import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Zalando Sans'],
      },
      colors: {
         primary: {
          DEFAULT: '#4eb00f',
          50:  '#f2fce8',
          100: '#e0f8cc',
          200: '#c3f09f',
          300: '#9de36a',
          400: '#78d13d',
          500: '#4eb00f',
          600: '#3d8f0b',
          700: '#2e6c08',
          800: '#1f4a06',
          900: '#102703',
          950: '#081402',
        },
      },
    },
  },
} satisfies Config
