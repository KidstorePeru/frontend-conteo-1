import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permite que Railway y otros hosts accedan
    port: 5173, // puerto por defecto de Vite
  },
  preview: {
    port: 8080, // puerto que Railway usará en producción (puede ser 8080 o dejarlo sin definir)
    host: true
  }
})