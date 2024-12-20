import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Cambia '/' si estás usando un subdirectorio en Netlify
})
