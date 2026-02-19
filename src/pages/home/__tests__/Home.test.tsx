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

describe('Iteración 4 - Toggle card/list view', () => {
  it.todo('should not display product descriptions and nutriscore in card view')
  it.todo(
    'should display product descriptions and nutriscore when switching to list view',
  )
  it.todo(
    'should hide product descriptions and nutriscore when switching back to card view',
  )
})

describe('Iteración 5 - Modal de producto', () => {
  it.todo('should open a dialog with product details when clicking a product')
  it.todo('should close the dialog when clicking close button')
})
