import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}', './electron/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Sora', 'Inter', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        surface: 'hsl(var(--surface))',
        panel: 'hsl(var(--panel))',
        border: 'hsl(var(--border))',
        text: 'hsl(var(--text))',
        muted: 'hsl(var(--muted))',
        accent: 'hsl(var(--accent))',
        accentForeground: 'hsl(var(--accent-foreground))'
      },
      boxShadow: {
        glow: '0 24px 80px rgba(14, 18, 28, 0.45)'
      },
      keyframes: {
        floatIn: {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
        }
      },
      animation: {
        floatIn: 'floatIn 180ms ease-out'
      }
    }
  },
  plugins: []
} satisfies Config;