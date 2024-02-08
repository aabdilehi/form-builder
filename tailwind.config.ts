import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        "primary": "#92140C",
        "primary-hover": "#EE3C2F",
        "secondary": "#FFCF99",
        "secondary-hover": "#FFECD6",
        "light": "#FFF8F0",
        "dark": "#1E1E24",
      }
    },
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '2': '2px',
      '2.5' : '2.5px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
    },
    transitionProperty: {
      'height': 'height',
      'spacing': 'margin, padding',
    }
  },
  plugins: [],
} satisfies Config