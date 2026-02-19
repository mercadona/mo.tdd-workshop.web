import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { App } from 'app'
import { clickCategory } from '../../../test/helpers'

it('should navigate to the category page and display the category title', async () => {
  render(<App />)
  const user = userEvent.setup()

  await screen.findByText('Fruta y verdura')

  await clickCategory(user, 'Fruta y verdura')

  expect(
    await screen.findByRole('heading', { name: 'Fruta y verdura' }),
  ).toBeVisible()

  const productCard = await screen.findByRole('article', {
    name: 'Aguacate',
  })
  expect(productCard).toBeVisible()
})

it('should display a not found message when the category does not exist', async () => {
  window.history.pushState({}, '', '/categories/non-existent-slug')

  render(<App />)

  expect(
    await screen.findByText(/categoría no encontrada|category not found/i),
  ).toBeVisible()
})

it('should navigate to home when clicking the logo', async () => {
  const user = userEvent.setup()
  render(<App />)

  await screen.findByText('Fruta y verdura')
  await clickCategory(user, 'Fruta y verdura')
  await screen.findByRole('heading', { name: 'Fruta y verdura' })

  const logo = screen.getByRole('link', { name: 'Mercadona' })
  await user.click(logo)

  expect(screen.queryByRole('heading', { name: 'Fruta y verdura' })).not.toBeInTheDocument()
  expect(await screen.findByText('Fruta y verdura')).toBeVisible()
})

it('should highlight the active category in the navigation', async () => {
  const user = userEvent.setup()
  render(<App />)

  await screen.findByText('Fruta y verdura')

  await clickCategory(user, 'Fruta y verdura')

  const activeLink = screen.getByRole('link', {
    name: 'Fruta y verdura',
    current: 'page',
  })
  expect(activeLink).toBeVisible()
})

describe('Iteración 5 - Modal de producto desde categoría', () => {
  it.todo(
    'should open a dialog with product details when clicking a product from category',
  )
  it.todo('should close the dialog when clicking close button from category')
})
