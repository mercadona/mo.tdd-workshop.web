import { useEffect, useState } from 'react'
import type { Category, Product } from 'types'

export const useCategoryWithProducts = (slug: string | undefined) => {
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchCategory = async () => {
      const response = await fetch(`/categories/${slug}`)

      if (!response.ok) {
        setNotFound(true)
        return
      }

      const category = await response.json()
      setCategory(category)

      const productsResponse = await fetch(`/categories/${category.id}/products`)
      const productsData = await productsResponse.json()
      setProducts(productsData)
    }

    fetchCategory()
  }, [slug])

  return { category, products, notFound }
}
