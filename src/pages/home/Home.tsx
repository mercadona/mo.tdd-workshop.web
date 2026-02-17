import { useState } from 'react'
import { ProductCard } from 'components/product-card'
import { ProductDetail } from 'components/ProductDetail'
import { useProducts } from 'hooks/useProducts'
import type { Product } from 'types'

const Home = () => {
  const { products } = useProducts()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const handleProductClick = async (productId: number) => {
    const response = await fetch(`/products/${productId}`)
    const product = await response.json()
    setSelectedProduct(product)
  }

  const handleClose = () => {
    setSelectedProduct(null)
  }

  return (
    <div>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => handleProductClick(product.id)}
          />
        ))}
      </div>
      {selectedProduct && (
        <ProductDetail product={selectedProduct} onClose={handleClose} />
      )}
    </div>
  )
}

export { Home }
