import { screen, render, within } from '@testing-library/react'

import { App } from 'app'

it('should render correctly the home', () => {
  render(<App />)

  const homeTitle = screen.getByRole('heading', { name: 'Hello World!' })

  expect(homeTitle).toBeInTheDocument()
})

it('should render the list of categories on initial load', async () => {
  render(<App />)

  const categoryList = await screen.findByRole('list')
  const categories = within(categoryList).getAllByRole('listitem')

  expect(categories).toHaveLength(3)
  expect(screen.getByText('Fruta y verdura')).toBeVisible()
})
