/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cad: {
          bg: '#f8fafc',
          panel: '#ffffff',
          border: '#e2e8f0',
          darkBorder: '#cbd5e1',
          header: '#0f172a',
          activeBlue: '#2563eb',
          softBlue: '#eff6ff',
          gridLine: '#e2e8f0',
          rulerBg: '#f1f5f9',
          rulerTick: '#94a3b8',
          textMuted: '#64748b',
          textDark: '#0f172a',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
