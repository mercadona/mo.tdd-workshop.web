import '@testing-library/jest-dom/vitest'
import { render } from '@testing-library/react'
import { expect } from 'vitest'
import { configure, matchers } from 'wrapito'

const { VITE_API_HOST: defaultHost } = import.meta.env

configure({
  defaultHost,
  mount: render,
  portal: 'modal-root',
  changeRoute: (path) => {
    window.history.replaceState(null, '', path)
    window.dispatchEvent(
      new PopStateEvent('popstate', { state: window.history.state }),
    )
  },
})

vi.mock('services/monitoring/monitoring', () => {
  return {
    monitoring: {
      identify: vi.fn(),
      captureError: vi.fn(),
      sendMessage: vi.fn(),
      init: vi.fn(),
    },
  }
})

expect.extend(matchers)
