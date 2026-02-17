import { http, HttpResponse } from 'msw'
import categoriesFixtures from './categories-fixtures.json'
import productsFixtures from './products-fixtures.json'
import type { Category, Product } from '../types'

export const handlers = [
  http.get('/categories', () => {
    return HttpResponse.json(categoriesFixtures)
  }),
  http.get('/products', () => {
    return HttpResponse.json(productsFixtures)
  }),
  http.get('/categories/:slug', ({ params }) => {
    const { slug } = params
    const category = (categoriesFixtures as Category[]).find(
      (cat) => cat.slug === slug,
    )

    if (!category) {
      return new HttpResponse(null, { status: 404 })
    }

    const categoryProducts = (productsFixtures as Product[]).filter(
      (product) => product.categoryId === category.id,
    )

    return HttpResponse.json({
      ...category,
      products: categoryProducts,
    })
  }),
  http.get('/products/:id', ({ params }) => {
    const { id } = params
    const product = (productsFixtures as Product[]).find(
      (product) => product.id === Number(id),
    )

    if (!product) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(product)
  }),
]
