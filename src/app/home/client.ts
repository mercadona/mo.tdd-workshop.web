import { Http } from 'services/http'

import { Product } from './types'

const getProducts = async (): Promise<Array<Product>> => {
  // @ts-expect-error fixme
  return Http.get('/home/', { postalCode: 46021 })
}

const HomeClient = {
  getProducts,
}

export { HomeClient }
