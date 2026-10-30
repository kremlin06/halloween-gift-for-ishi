import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The base must match the GitHub repository name: /<repository-name>/
export default defineConfig({
  plugins: [react()],
  base: '/halloween-gift-for-ishi/',
})
