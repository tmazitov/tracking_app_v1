import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      "/aaa/api": {
        target: "http://127.0.0.1:5000",
      },
      "/tms/api": {
        target: "http://127.0.0.1:5001",
      },
      "/adm/api": {
        target: "http://127.0.0.1:5002",  
      },
      // "/tms/ws": {
      //   target: "ws://127.0.0.1:5001",
      //   changeOrigin: true,
      //   ws: true
      // },
    }
  },
})
