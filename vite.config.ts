// vite.config.ts (VERSIÓN FINAL, COMPLETA Y FUNCIONAL)

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // <-- Necesitamos esto para crear la ruta al alias

export default defineConfig({
  plugins: [react()],
  base: './',
  
  optimizeDeps: {
    exclude: ['react-native'],
  },

  // --- ¡LA SOLUCIÓN DEFINITIVA ESTÁ AQUÍ! ---
  // Creamos un alias. Cuando algo pida 'react-native', 
  // le daremos nuestro archivo falso en su lugar.
  resolve: {
    alias: {
      'react-native': path.resolve(__dirname, './src/mocks/react-native.js'),
    },
  },
})