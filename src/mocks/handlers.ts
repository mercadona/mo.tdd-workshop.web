import { http, HttpResponse } from 'msw'
import categoriesFixtures from './categories-fixtures.json'
import productsFixtures from './products-fixtures.json'

export const handlers = [
  http.get('/categories', () => {
    return HttpResponse.json(categoriesFixtures)
  }),
  http.get('/products', () => {
    return HttpResponse.json(productsFixtures)
  }),
]
