import path from 'node:path';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      autoCodeSplitting: true,
      generatedRouteTree: './src/routeTree.gen.ts',
      routeFileIgnorePattern: '\\.(test)\\.(ts|tsx)$',
      routesDirectory: './src/routes',
      target: 'react',
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
});
