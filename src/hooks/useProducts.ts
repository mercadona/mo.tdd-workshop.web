import { useEffect, useState } from 'react'
import type { Product } from 'types'

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/products')
      const data = await response.json()
      setProducts(data)
    }
    fetchProducts()
  }, [])

  return { products }
}
