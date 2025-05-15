import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    host: '0.0.0.0',
    port: 3500,
    proxy: {
      '/bridges': 'http://localhost:8000',
      '/mqtt': 'http://localhost:8000',
      '/http': 'http://localhost:8000'
    }
  }
});