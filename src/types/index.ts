export interface Category {
  id: number
  displayName: string
  slug: string
}

export interface Product {
  id: number
  displayName: string
  image: string
  price: number
  categoryId: number
  description?: string
}
