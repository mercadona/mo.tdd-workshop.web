import { screen, render } from '@testing-library/react'
// import { within } from '@testing-library/react'
// import { userEvent } from '@testing-library/user-event'
import { App } from 'app'

it('should render correctly the home', () => {
  render(<App />)
  const homeTitle = screen.getByRole('heading', { name: 'Hello World!' })
  expect(homeTitle).toBeInTheDocument()
})

describe('Iteración 1 - Listado de categorías', () => {
  it.todo('should render the list of categories in the navigation')
})

describe('Iteración 2 - Listado de productos', () => {
  it.todo('should display the products with their prices correctly formatted')
})

describe('Iteración 4 - Toggle card/list view', () => {
  it.todo('should display product descriptions when switching to list view')
  it.todo('should hide product descriptions when switching back to card view')
})

describe('Iteración 5 - Modal de producto', () => {
  it.todo('should open a dialog with product details when clicking a product')
  it.todo('should close the dialog when clicking close button')
  it.todo('should close the dialog when clicking outside the modal [OPTIONAL]')
  it.todo('should close the dialog when pressing ESC key [OPTIONAL]')
})
