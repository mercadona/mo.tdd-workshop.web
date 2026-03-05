import { render, screen } from '@testing-library/react'

import { App } from 'app'

it('should render correctly the not found page', async () => {
  window.history.replaceState({}, '', '/not-found')
  render(<App />)
  expect(screen.getByText(/notfound page/i)).toBeInTheDocument()
})
