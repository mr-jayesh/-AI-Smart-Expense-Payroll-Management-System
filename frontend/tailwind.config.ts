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
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                // Light Theme
                'bg-primary': '#FAFBFC',
                'bg-secondary': '#F7F8FA',
                'bg-card': '#FFFFFF',

                // Vibrant Accent Colors (Dribbble-inspired)
                'purple': {
                    500: '#6366F1',
                    600: '#8B5CF6',
                },
                'cyan': {
                    500: '#06B6D4',
                    600: '#14B8A6',
                },

                // Text Colors
                'text-primary': '#1F2937',
                'text-secondary': '#6B7280',
                'text-muted': '#9CA3AF',
            },
            backgroundImage: {
                'gradient-purple': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                'gradient-cyan': 'linear-gradient(135deg, #06B6D4 0%, #14B8A6 100%)',
                'gradient-purple-cyan': 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
            },
            boxShadow: {
                'card': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                'card-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
            borderRadius: {
                'card': '16px',
            },
        },
    },
    plugins: [],
}
export default config
