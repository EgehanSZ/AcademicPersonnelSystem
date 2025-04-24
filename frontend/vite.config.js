import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Tüm ağ arayüzlerini dinler
    port: 5173,
    proxy: {
      '/upload': {
        target: 'https://mockapi.io', // API'nin gerçek adresi
        changeOrigin: true, // Origin'in değiştirilmesini sağlar
        secure: false, // Eğer HTTPS değilse 'false' yapın
        rewrite: (path) => path.replace(/^\/upload/, ''), // İsteği doğru URL'ye yönlendirir
      },
    },
  },
})
