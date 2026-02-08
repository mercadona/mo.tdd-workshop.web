/// <reference types="vitest" />
/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />
import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = 'config/env/'
  const env = loadEnv(mode, `${process.cwd()}/${envDir}`)

  return {
    plugins: [
      react(),
      tsConfigPaths(),
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: process.env.SENTRY_ORG,
        project: env.VITE_APP_NAME,
        release: {
          name: env.VITE_APP_VERSION,
          setCommits: false,
        },
      }),
    ],
    envDir,
    test: {
      restoreMocks: true,
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts', 'setup.ts'],
    },
    server: {
      host: 'localhost',
      port: 3000,
      https: {
        cert: resolve(__dirname, 'config/local-certificate/localhost.crt'),
        key: resolve(__dirname, 'config/local-certificate/localhost.key'),
      },
    },
    build: {
      outDir: 'build',
      sourcemap: true,
    },
  }
})
