import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
  },
  // This hook runs after build completes
  closeBundle() {
    const src = path.resolve(__dirname, '_redirects');
    const dest = path.resolve(__dirname, 'dist/_redirects');

    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log('✅ Copied _redirects file to dist/');
    } else {
      console.warn('⚠️  _redirects file not found. Skipping copy.');
    }
  }
});
