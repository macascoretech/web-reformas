/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                primary: '#1F3E5A',
                secondary: '#5A7285',
                accent: '#D98B2B',
                gray: {
                    DEFAULT: '#8A8F94',
                    100: '#f3f4f5',
                    200: '#e5e7e9',
                    300: '#d1d5d8',
                    400: '#a3a8ad',
                    500: '#8A8F94',
                    600: '#6e7378',
                    700: '#52575b',
                    800: '#363b3e',
                    900: '#1a1e21',
                },
                light: '#F3F4F5',
            },
            fontFamily: {
                sans: ['Roboto', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out',
                'fade-in-up': 'fadeInUp 0.7s ease-out',
                'slide-in-left': 'slideInLeft 0.7s ease-out',
                'slide-in-right': 'slideInRight 0.7s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-40px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(40px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },
        },
    },
    plugins: [],
};
