import type { Product } from 'types'

export const ProductMother = {
  create: (overrides?: Partial<Product>): Product => ({
    id: 1,
    slug: 'manzana-royal-gala',
    displayName: 'Manzana Royal Gala',
    nutriscore: 'A',
    image: '/images/manzana.jpg',
    thumbnail: '/images/manzana_thumb.jpg',
    price: 2.49,
    referenceFormat: 'kg',
    categoryId: 1,
    ...overrides,
  }),
}
