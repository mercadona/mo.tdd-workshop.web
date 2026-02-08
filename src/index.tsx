import 'normalize.css'
import { createRoot } from 'react-dom/client'

import { ServiceWorker } from '@mercadona/mo.library.web-services/service-worker'

import { monitoring } from 'services/monitoring'

import { App } from './app'
import './system-ui/styles/index.css'

monitoring.init()

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
root.render(<App />)

ServiceWorker.register(ServiceWorker.config)
