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
