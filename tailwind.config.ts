import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#006C49',
        'primary-container': '#7EF8C1',
        secondary: '#536E56',
        'secondary-container': '#D7F8DE',
        tertiary: '#B3261E',
        'tertiary-container': '#F9DEDC',
        surface: '#FFFBFE',
        'surface-dim': '#F3EEF1',
        'surface-bright': '#FFFBFE',
        'surface-container': '#F7F2F5',
        'surface-container-low': '#F2EDF0',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-high': '#ECE6E9',
        'surface-container-highest': '#E6E0E3',
        outline: '#79747E',
        'outline-variant': '#CAC7D0',
        'on-surface': '#1C1B1F',
        'on-surface-variant': '#49454F',
        'on-background': '#1C1B1F',
        'on-primary': '#FFFFFF',
        'on-primary-container': '#002110',
        'on-secondary-container': '#0F2818',
        'on-tertiary-container': '#410E0B',
        background: '#FFFBFE',
      },
      fontFamily: {
        headline: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'label-large': ['0.875rem', '1.25rem'],
        'label-medium': ['0.75rem', '1.25rem'],
        'label-small': ['0.6875rem', '1.25rem'],
      },
      boxShadow: {
        'glass': '0 0.3px 0.9px rgba(0, 0, 0, 0.12), 0 1.6px 3.6px rgba(0, 0, 0, 0.16)',
      },
      backdropBlur: {
        'glass': '10px',
      },
    },
  },
  plugins: [],
}
export default config
