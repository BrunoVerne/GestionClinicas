import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',          // importante para que Electron cargue bien los assets
  build: {
    outDir: 'dist',
  },
})