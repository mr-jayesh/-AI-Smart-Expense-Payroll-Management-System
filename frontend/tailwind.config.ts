import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            colors: {
                // Premium Dark Theme
                'bg-primary': '#0a0e1a',
                'bg-secondary': '#0f1729',
                'bg-tertiary': '#1a1f3a',
                
                // Accent Colors
                'accent-primary': '#6366f1',
                'accent-secondary': '#14b8a6',
                'accent-purple': '#8b5cf6',
                'accent-pink': '#ec4899',
                
                // Text Colors
                'text-primary': '#ffffff',
                'text-secondary': '#94a3b8',
                'text-muted': '#64748b',
                
                // Glass
                'glass-bg': 'rgba(255, 255, 255, 0.05)',
                'glass-border': 'rgba(255, 255, 255, 0.1)',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                'gradient-secondary': 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
                'gradient-dark': 'linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 50%, #0f1729 100%)',
            },
            backdropBlur: {
                'glass': '20px',
            },
            boxShadow: {
                'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
                'glow': '0 0 20px rgba(99, 102, 241, 0.5)',
            },
        },
    },
    plugins: [],
}
export default config
