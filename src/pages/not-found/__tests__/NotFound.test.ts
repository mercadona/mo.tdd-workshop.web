import { screen } from '@testing-library/react'
import { wrap } from 'wrapito'

import { App } from 'app'

it('should render correctly the not found page', () => {
  wrap(App).atPath('/not-found').mount()

  const notFoundTitle = screen.getByText(/notfound page/i)

  expect(notFoundTitle).toBeInTheDocument()
})
