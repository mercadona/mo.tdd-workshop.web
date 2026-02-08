/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROJECT_NAME: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENV: string

  readonly VITE_SENTRY_DSN: string

  readonly VITE_ELASTIC_APM_HOST: string
  readonly VITE_KIBANA_HOST: string

  readonly VITE_API_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
