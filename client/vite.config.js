import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync } from 'fs';

// ⬇ Custom plugin to copy _redirects into dist
function copyRedirects() {
  return {
    name: 'copy-redirects',
    closeBundle() {
      copyFileSync(resolve(__dirname, '_redirects'), resolve(__dirname, 'dist/_redirects'));
    },
  };
}

export default defineConfig({
  plugins: [react(), copyRedirects()],
});
