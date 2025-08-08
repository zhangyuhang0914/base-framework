/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./node_modules/antd/dist/antd.css",
    "./src/**/*.{vue,js,ts,jsx,tsx,pug}"
  ],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'text-muted-foreground': '#71717a'
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
