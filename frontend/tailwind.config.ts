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
                'bg-primary': '#F1F5F9',
                'bg-secondary': '#F8FAFC',
                'bg-card': '#FFFFFF',

                // Sidebar
                'sidebar': {
                    DEFAULT: '#0F172A',
                    hover: '#1E293B',
                },

                // Chart Colors (exact from reference)
                'chart': {
                    purple: '#8B5CF6',
                    pink: '#EC4899',
                    cyan: '#06B6D4',
                    yellow: '#F59E0B',
                    green: '#10B981',
                },

                // Text Colors
                'text-primary': '#1F2937',
                'text-secondary': '#6B7280',
                'text-muted': '#9CA3AF',
            },
            boxShadow: {
                'card': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                'card-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
        },
    },
    plugins: [],
}
export default config
