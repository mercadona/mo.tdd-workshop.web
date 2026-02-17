import { useState } from 'react'
import type { Product } from 'types'

export const useProductDialog = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const handleProductClick = async (productId: number) => {
    const response = await fetch(`/products/${productId}`)
    const product = await response.json()
    setSelectedProduct(product)
  }

  const handleClose = () => {
    setSelectedProduct(null)
  }

  return { selectedProduct, handleProductClick, handleClose }
}
