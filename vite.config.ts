import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['aws-amplify'],
    esbuildOptions: {
      resolveExtensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
      define: {
        global: 'globalThis',
      },
    }
  },
  resolve: {
    alias: {
      'aws-amplify/api': '@aws-amplify/api',
      'aws-amplify/auth': '@aws-amplify/auth',
      'aws-amplify/storage': '@aws-amplify/storage',
    }
  }
})


