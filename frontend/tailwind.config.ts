import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4F46E5', // Indigo 600
                secondary: '#10B981', // Emerald 500
                dark: '#1F2937', // Gray 800
                light: '#F3F4F6', // Gray 100
            },
        },
    },
    plugins: [],
}
export default config
