/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#0a0f1e',
        surface: '#111827',
        surface2: '#1a2235',
        indigo: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
          dim: 'rgba(99,102,241,0.15)',
        },
        border: {
          DEFAULT: 'rgba(99,120,160,0.18)',
          strong: 'rgba(99,120,160,0.35)',
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
