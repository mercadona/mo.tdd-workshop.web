import { screen, render, within } from '@testing-library/react'

import { App } from 'app'

it('should render the list of categories in the navigation', async () => {
  render(<App />)

  const nav = screen.getByRole('navigation')
  const categoryList = await within(nav).findByRole('list')
  const categories = within(categoryList).getAllByRole('listitem')

  expect(categories).toHaveLength(3)
  expect(within(nav).getByText('Fruta y verdura')).toBeVisible()
})

it('should display the products with their prices correctly formatted', async () => {
  render(<App />)

  const productCard = await screen.findByRole('article', {
    name: 'Aceitunas verdes rellenas de anchoa Hacendado',
  })

  expect(within(productCard).getByText('3,00 €')).toBeVisible()
})
