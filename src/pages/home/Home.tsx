import { ProductCard } from 'components/product-card'
import { ProductDetail } from 'components/ProductDetail'
import { useProducts } from 'hooks/useProducts'
import { useProductDialog } from 'hooks/useProductDialog'

const Home = () => {
  const { products } = useProducts()
  const { selectedProduct, handleProductClick, handleClose } =
    useProductDialog()

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
