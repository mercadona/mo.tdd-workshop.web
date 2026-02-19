import { screen, render } from '@testing-library/react'
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
