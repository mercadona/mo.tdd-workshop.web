/// <reference types="vitest" />
/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />
import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsConfigPaths()],
  envDir: 'config/env/',
  test: {
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globals: true,
    css: true,
  },
} as UserConfig)
