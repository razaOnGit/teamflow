import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    cors: true,
    headers: {
      'X-Frame-Options': 'SAMEORIGIN'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})