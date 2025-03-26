// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync } from 'fs';

function copyRedirects() {
  return {
    name: 'copy-redirects',
    closeBundle() {
      try {
        copyFileSync(resolve(__dirname, '_redirects'), resolve(__dirname, 'dist/_redirects'));
        console.log('✅ _redirects copied into dist');
      } catch (err) {
        console.error('❌ Failed to copy _redirects:', err);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copyRedirects()],
});
