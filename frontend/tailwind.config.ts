import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d4af37',
        'primary-dark': '#b69121',
        secondary: '#0a0a0a',
        accent: '#1a1a1a',
        'text-light': '#f5f5f5',
        'text-muted': '#a0a0a0',
        'bg-main': '#050505',
        'glass-bg': 'rgba(255, 255, 255, 0.05)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
export default config
