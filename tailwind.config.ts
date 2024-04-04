import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens: {
        'xxs': '400px',
      },
      colors: {
        'dark-bg': 'var(--dark-bg-color)',
        'dark-text': 'var(--dark-text-color)',
        'light-bg': 'var(--light-bg-color)',
        'light-text': 'var(--light-text-color)',
        'top-bar-orange' : '#fa3',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
export default config
