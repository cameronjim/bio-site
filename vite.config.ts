import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  // Dev-only: proxy /api → the production API so the admin tool and token gate
  // work locally without tripping the API's CORS (it only allows the prod origin).
  // Requests stay same-origin to the dev server, which forwards them server-side.
  server: {
    proxy: {
      '/api': {
        target: 'https://api.cameronjim.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
