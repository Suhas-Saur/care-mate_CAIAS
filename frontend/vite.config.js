import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // The react() plugin handles JSX compilation, Fast Refresh, and Babel integration
  plugins: [react()],
})