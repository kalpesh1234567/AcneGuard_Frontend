/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                teal: {
                    500: '#0D9488', // Primary
                    600: '#0F766E',
                },
                slate: {
                    50: '#F8FAFC',  // Background
                    900: '#0F172A', // Text Primary
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
