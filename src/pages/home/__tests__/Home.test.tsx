import { screen, render, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { App } from 'app'
import { clickProduct, toggleViewMode } from 'test/helpers'

describe('Iteración 1 - Listado de categorías', () => {
  it('should render the list of categories in the navigation', async () => {
    render(<App />)

    const nav = screen.getByRole('navigation')
    const categoryList = await within(nav).findByRole('list')
    const categories = within(categoryList).getAllByRole('listitem')

    expect(categories).toHaveLength(3)
    expect(within(nav).getByText('Fruta y verdura')).toBeVisible()
  })
})

describe('Iteración 2 - Listado de productos', () => {
  it('should display the products with their prices correctly formatted', async () => {
    render(<App />)

    const products = await screen.findAllByRole('article')
    const firstProduct = products[0]
    const lastProduct = products[products.length - 1]

    expect(products).toHaveLength(24)
    expect(
      within(firstProduct).getByRole('heading', {
        name: 'Aceitunas verdes rellenas de anchoa Hacendado',
        level: 3,
      }),
    ).toBeVisible()
    expect(
      within(firstProduct).getByRole('img', {
        name: 'Aceitunas verdes rellenas de anchoa Hacendado',
      }),
    ).toBeVisible()
    expect(within(firstProduct).getByText('3,00 €')).toBeVisible()
    expect(
      within(lastProduct).getByRole('heading', { name: 'Aguacate', level: 3 }),
    ).toBeVisible()
  })
})

describe('Iteración 4 - Toggle card/list view', () => {
  it('should display product descriptions when switching to list view', async () => {
    const user = userEvent.setup()
    render(<App />)

    await screen.findByRole('article', {
      name: 'Aceitunas verdes rellenas de anchoa Hacendado',
    })

    expect(
      screen.queryByText(/Aceitunas verdes rellenas con anchoas de calidad/),
    ).not.toBeInTheDocument()

    await toggleViewMode(user)

    expect(
      screen.getByText(/Aceitunas verdes rellenas con anchoas de calidad/),
    ).toBeVisible()
  })

  it('should hide product descriptions when switching back to card view', async () => {
    const user = userEvent.setup()
    render(<App />)

    await screen.findByRole('article', {
      name: 'Aceitunas verdes rellenas de anchoa Hacendado',
    })

    await toggleViewMode(user)

    expect(
      screen.getByText(/Aceitunas verdes rellenas con anchoas de calidad/),
    ).toBeVisible()

    await toggleViewMode(user)

    expect(
      screen.queryByText(/Aceitunas verdes rellenas con anchoas de calidad/),
    ).not.toBeInTheDocument()
  })
})

describe('Iteración 5 - Modal de producto', () => {
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
        /Aceitunas verdes rellenas con anchoas de calidad/,
      ),
    ).toBeVisible()
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

  it.todo('should close the dialog when clicking outside the modal [OPTIONAL]')
  it.todo('should close the dialog when pressing ESC key [OPTIONAL]')
})
