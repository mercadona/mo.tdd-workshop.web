import { http, HttpResponse } from 'msw'
import categoriesFixtures from './categories-fixtures.json'

export const handlers = [
  http.get('/categories', () => {
    return HttpResponse.json(categoriesFixtures)
  }),
]
