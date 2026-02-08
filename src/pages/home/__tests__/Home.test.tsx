import { screen, render } from '@testing-library/react'

import { App } from 'app'

it('should render correctly the home', () => {
  render(<App />)

  const homeTitle = screen.getByRole('heading', { name: 'Hello World!' })

  expect(homeTitle).toBeInTheDocument()
})
