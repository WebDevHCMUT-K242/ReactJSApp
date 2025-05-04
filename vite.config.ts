import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),     tailwindcss(),],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api'),
      },
      '/uploaded_images': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/uploaded_images/, '/uploaded_images'),
      },
    }
  }
})
