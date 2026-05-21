import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // GitHub Pages: https://jakesales.github.io/mortgagedemo/
  base: '/mortgagedemo/',
  plugins: [react(), tailwindcss()],
})
