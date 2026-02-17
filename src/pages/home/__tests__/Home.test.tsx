import { screen, render, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { App } from 'app'
import { toggleViewMode } from 'test/helpers'

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

it('should not display product descriptions and nutriscore in card view', async () => {
  render(<App />)

  await screen.findByRole('article', {
    name: 'Aceitunas verdes rellenas de anchoa Hacendado',
  })

  expect(
    screen.queryByText(/Aceitunas verdes rellenas con anchoas de calidad/),
  ).not.toBeInTheDocument()
  expect(screen.queryByText(/Nutriscore: D/)).not.toBeInTheDocument()
})

it('should display product descriptions and nutriscore when switching to list view', async () => {
  const user = userEvent.setup()
  render(<App />)

  const productCard = await screen.findByRole('article', {
    name: 'Aceitunas verdes rellenas de anchoa Hacendado',
  })

  expect(
    screen.queryByText(/Aceitunas verdes rellenas con anchoas de calidad/),
  ).not.toBeInTheDocument()
  expect(
    within(productCard).queryByText(/Nutriscore: D/),
  ).not.toBeInTheDocument()

  await toggleViewMode(user)

  expect(
    screen.getByText(/Aceitunas verdes rellenas con anchoas de calidad/),
  ).toBeVisible()
  expect(within(productCard).getByText(/Nutriscore: D/)).toBeVisible()
})

it('should hide product descriptions and nutriscore when switching back to card view', async () => {
  const user = userEvent.setup()
  render(<App />)

  const productCard = await screen.findByRole('article', {
    name: 'Aceitunas verdes rellenas de anchoa Hacendado',
  })

  await toggleViewMode(user)

  expect(
    screen.getByText(/Aceitunas verdes rellenas con anchoas de calidad/),
  ).toBeVisible()
  expect(within(productCard).getByText(/Nutriscore: D/)).toBeVisible()

  await toggleViewMode(user)

  expect(
    screen.queryByText(/Aceitunas verdes rellenas con anchoas de calidad/),
  ).not.toBeInTheDocument()
  expect(
    within(productCard).queryByText(/Nutriscore: D/),
  ).not.toBeInTheDocument()
})
