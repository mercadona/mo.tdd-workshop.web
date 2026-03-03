import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { App } from 'app'
import { clickCategory } from 'test/helpers'

describe('Iteración 3 - Navegación y routing', () => {
  it('should navigate to the category page and display the category title', async () => {
    const user = userEvent.setup()
    render(<App />)

    await clickCategory(user, 'Fruta y verdura')

    expect(
      await screen.findByRole('heading', { name: 'Fruta y verdura' }),
    ).toBeVisible()
  })

  it('should show the category products', async () => {
    const user = userEvent.setup()
    render(<App />)

    await clickCategory(user, 'Fruta y verdura')

    expect(
      await screen.findByRole('article', { name: 'Aguacate' }),
    ).toBeVisible()
  })

  it('should navigate to home when clicking the logo [OPTIONAL]', async () => {
    const user = userEvent.setup()
    render(<App />)

    await clickCategory(user, 'Fruta y verdura')
    await screen.findByRole('heading', { name: 'Fruta y verdura' })

    const logo = screen.getByRole('link', { name: 'Mercadona' })
    await user.click(logo)

    expect(
      screen.queryByRole('heading', { name: 'Fruta y verdura' }),
    ).not.toBeInTheDocument()
  })

  it('should highlight the active category in the navigation [OPTIONAL]', async () => {
    const user = userEvent.setup()
    render(<App />)

    await clickCategory(user, 'Fruta y verdura')

    expect(
      screen.getByRole('link', { name: 'Fruta y verdura', current: 'page' }),
    ).toBeVisible()
  })

  it('should display a not found message when the category does not exist [OPTIONAL]', async () => {
    window.history.pushState({}, '', '/categories/non-existent-slug')
    render(<App />)

    expect(
      await screen.findByText(/categoría no encontrada/i),
    ).toBeVisible()
  })
})

describe('Iteración 5 - Modal de producto desde categoría', () => {
  it.todo(
    'should open a dialog with product details when clicking a product from category',
  )
  it.todo('should close the dialog when clicking close button from category')
  it.todo('should close the dialog when clicking outside the modal [OPTIONAL]')
  it.todo('should close the dialog when pressing ESC key [OPTIONAL]')
})
