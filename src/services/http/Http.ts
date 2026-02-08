import { createHttpClient } from '@mercadona/mo.library.web-services/http'

const API_HOST = import.meta.env.VITE_API_HOST
const APP_VERSION = import.meta.env.VITE_APP_VERSION

const settings = {
  getHeaders: function () {
    return {
      'Content-Type': 'application/json',
      'X-Version': APP_VERSION,
    }
  },
  API_HOST,
}

const Http = createHttpClient(settings)

export { Http }
