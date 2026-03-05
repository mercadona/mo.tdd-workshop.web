import { http, HttpResponse } from 'msw'
import categoriesFixtures from './categories-fixtures.json'
// import productsFixtures from './products-fixtures.json'

export const handlers = [
  http.get('/categories', () => {
    return HttpResponse.json(categoriesFixtures)
  }),
  // Iteración 2
  // http.get('/products', () => {
  //   return HttpResponse.json(productsFixtures)
  // }),
  // Iteración 3
  // http.get('/categories/:slug', ({ params }) => {
  //   ...
  // }),
  // http.get('/categories/:categoryId/products', ({ params }) => {
  //   ...
  // }),
]
