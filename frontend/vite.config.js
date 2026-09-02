import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/care-mate_CAIAS/',
  server: {
    host: true,
    port: 4000,
    strictPort: false
  }
})