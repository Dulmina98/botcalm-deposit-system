/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#050d1a',
        surface: '#0a1628',
        surface2: '#0f1f35',
        accent: {
          DEFAULT: '#14b8a6',
          light: '#2dd4bf',
          dim: 'rgba(20,184,166,0.12)',
        },
        border: {
          DEFAULT: 'rgba(20,184,166,0.15)',
          strong: 'rgba(20,184,166,0.30)',
        },
        text: {
          DEFAULT: '#e2e8f0',
          muted: '#64748b',
          dim: '#94a3b8',
        },
        status: {
          yellow: '#eab308',
          green: '#22c55e',
          red: '#ef4444',
        },
      },
    },
  },
  plugins: [],
}
