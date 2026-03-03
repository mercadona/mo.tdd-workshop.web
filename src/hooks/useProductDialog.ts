import { useState } from 'react'
import type { Product } from 'types'

export const useProductDialog = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
  }

  const handleClose = () => {
    setSelectedProduct(null)
  }

  return { selectedProduct, handleProductClick, handleClose }
}
