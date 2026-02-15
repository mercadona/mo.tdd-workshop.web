export interface Category {
  id: number
  displayName: string
  slug: string
}

export interface Product {
  id: number
  slug: string
  displayName: string
  nutriscore: string
  image: string
  thumbnail: string
  price: number
  referenceFormat: string
  categoryId: number
  description?: string
}
