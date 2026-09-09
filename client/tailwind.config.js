/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        '3xl': '1800px',
        '4xl': '2200px',
      },
      colors: {
        // Stitch Bauhaus Edition design system tokens
        'background': '#f5f0e8',
        'surface': '#f5f0e8',
        'surface-bright': '#faf7f2',
        'surface-dim': '#d6d1c9',
        'surface-variant': '#e8e3da',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f2ede5',
        'surface-container': '#eee9e0',
        'surface-container-high': '#e8e3da',
        'surface-container-highest': '#e2ddd4',
        'on-background': '#1a1a1a',
        'on-surface': '#1a1a1a',
        'on-surface-variant': '#4a4a4a',
        'primary': '#1a1a1a',
        'primary-container': '#ffcc00',
        'primary-fixed': '#ffcc00',
        'primary-fixed-dim': '#e6b800',
        'on-primary': '#ffffff',
        'on-primary-container': '#1a1a1a',
        'secondary': '#e63b2e',
        'secondary-container': '#ffdad6',
        'tertiary': '#0055ff',
        'tertiary-container': '#d6e3ff',
        'outline': '#1a1a1a',
        'outline-variant': '#d0cbc3',
        'error': '#cc0000',
        'error-container': '#ffdad6',

        // Bauhaus palette utilities
        bauhaus: {
          cream: '#f5f0e8',
          black: '#1a1a1a',
          yellow: '#ffcc00',
          red: '#e63b2e',
          blue: '#0055ff',
          paper: '#faf7f2',
          muted: '#8a8780',
          border: '#1a1a1a',
        },
      },
      spacing: {
        'space-xxs': '0.25rem',
        'space-xs': '0.5rem',
        'space-sm': '0.75rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2rem',
        'space-2xl': '3rem',
        'space-3xl': '4rem',
        'gutter-desktop': '2rem',
        'gutter-mobile': '1rem',
        'margin-desktop': '3.5rem',
        'margin-mobile': '1.25rem',
      },
      fontFamily: {
        headline: ['Space Grotesk', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        label: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['Space Grotesk', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(34, 211, 238, 0.35)',
        'glow-violet': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'glow-teal': '0 0 25px -5px rgba(45, 212, 191, 0.35)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'brutalist-sm': '2px 2px 0px #1a1a1a',
        'brutalist': '4px 4px 0px #1a1a1a',
        'brutalist-lg': '6px 6px 0px #1a1a1a',
        'brutalist-xl': '8px 8px 0px #1a1a1a',
        'bauhaus-sm': '2px 2px 0px #1a1a1a',
        'bauhaus': '3px 3px 0px #1a1a1a',
        'bauhaus-md': '4px 4px 0px #1a1a1a',
        'bauhaus-lg': '6px 6px 0px #1a1a1a',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'shimmer': 'shimmer 2s infinite linear',
        'spin-slow': 'spin 18s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
