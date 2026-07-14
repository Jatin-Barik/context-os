import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

const root = resolve(__dirname);

export default defineConfig({
  main: {
    build: {
      outDir: 'dist/main',
      rollupOptions: {
        input: {
          index: resolve(root, 'electron/main/index.ts')
        }
      }
    }
  },
  preload: {
    build: {
      outDir: 'dist/preload',
      rollupOptions: {
        input: {
          index: resolve(root, 'electron/preload/index.ts')
        }
      }
    }
  },
  renderer: {
    root: resolve(root, 'src/renderer'),
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(root, 'src'),
        '@main': resolve(root, 'electron/main'),
        '@preload': resolve(root, 'electron/preload'),
        '@shared': resolve(root, 'src/shared')
      }
    },
    build: {
      outDir: resolve(root, 'dist/renderer'),
      emptyOutDir: true
    }
  }
});