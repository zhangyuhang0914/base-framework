/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./node_modules/antd/dist/antd.css",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'text-muted-foreground': '#71717a'
    }
  },
  plugins: []
}
