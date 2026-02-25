import { defineConfig } from 'vite';

export default defineConfig({
  base: '/reaction-speed-game/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  }
});
