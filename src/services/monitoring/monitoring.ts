import {
  ElasticTransport,
  Monitoring,
  SentryTransport,
} from '@mercadona/mo.library.monitoring'

export const elasticTransport = new ElasticTransport({
  serviceName: import.meta.env.VITE_PROJECT_NAME,
  apmHost: import.meta.env.VITE_ELASTIC_APM_HOST,
  kibanaHost: import.meta.env.VITE_KIBANA_HOST,
  serviceVersion: import.meta.env.VITE_APP_VERSION,
  environment: import.meta.env.VITE_APP_ENV,
  enabled: import.meta.env.PROD,
})

export const sentryTransport = new SentryTransport({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  release: import.meta.env.VITE_APP_VERSION,
  environment: import.meta.env.VITE_APP_ENV,
  enabled: import.meta.env.PROD,
})

export const monitoring = new Monitoring({
  transports: [elasticTransport, sentryTransport],
})
