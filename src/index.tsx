import 'normalize.css'
import './styles/globals.css'
import { createRoot } from 'react-dom/client'

import { App } from './app'

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  const { worker } = await import('./mocks/browser')
  return worker.start()
}

enableMocking().then(() => {
  const container = document.getElementById('root') as HTMLElement
  const root = createRoot(container)
  root.render(<App />)
})
