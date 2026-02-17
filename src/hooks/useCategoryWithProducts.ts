import { useEffect, useState } from 'react'
import type { Category, Product } from 'types'

type CategoryWithProducts = Category & { products: Product[] }

export const useCategoryWithProducts = (slug: string | undefined) => {
  const [category, setCategory] = useState<CategoryWithProducts | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchCategory = async () => {
      const response = await fetch(`/categories/${slug}`)

      if (!response.ok) {
        setNotFound(true)
        return
      }

      const data = await response.json()
      setCategory(data)
    }

    fetchCategory()
  }, [slug])

  return { category, notFound }
}
