import { screen, render, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { App } from 'app'
import { clickProduct, toggleViewMode } from 'test/helpers'

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
  expect(screen.queryByLabelText(/Nutriscore: D/i)).not.toBeInTheDocument()
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
    within(productCard).queryByLabelText(/Nutriscore: D/i),
  ).not.toBeInTheDocument()

  await toggleViewMode(user)

  expect(
    screen.getByText(/Aceitunas verdes rellenas con anchoas de calidad/),
  ).toBeVisible()
  expect(within(productCard).getByLabelText(/Nutriscore: D/i)).toBeVisible()
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
  expect(within(productCard).getByLabelText(/Nutriscore: D/i)).toBeVisible()

  await toggleViewMode(user)

  expect(
    screen.queryByText(/Aceitunas verdes rellenas con anchoas de calidad/),
  ).not.toBeInTheDocument()
  expect(
    within(productCard).queryByLabelText(/Nutriscore: D/i),
  ).not.toBeInTheDocument()
})

it('should open a dialog with product details when clicking a product', async () => {
  const user = userEvent.setup()
  render(<App />)

  await clickProduct(user, 'Aceitunas verdes rellenas de anchoa Hacendado')

  const dialog = await screen.findByRole('dialog')
  expect(dialog).toBeVisible()
  expect(
    within(dialog).getByText('Aceitunas verdes rellenas de anchoa Hacendado'),
  ).toBeVisible()
  expect(within(dialog).getByText('3,00 €')).toBeVisible()
  expect(
    within(dialog).getByText(
      'Aceitunas verdes rellenas con anchoas de calidad. Perfectas para el aperitivo.',
    ),
  ).toBeVisible()
  expect(within(dialog).getByLabelText(/Nutriscore: D/i)).toBeVisible()
})

it('should close the dialog when clicking close button', async () => {
  const user = userEvent.setup()
  render(<App />)

  await clickProduct(user, 'Aceitunas verdes rellenas de anchoa Hacendado')

  await screen.findByRole('dialog')

  const closeButton = screen.getByRole('button', { name: /cerrar/i })
  await user.click(closeButton)

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})