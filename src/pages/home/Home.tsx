import classNames from 'classnames'
import { ProductCard } from 'components/product-card'
import { ProductDetail } from 'components/product-detail'
import { useProductDialog } from 'hooks/useProductDialog'
import { useProducts } from 'hooks/useProducts'
import { useViewMode } from 'hooks/useViewMode'
import './Home.css'

const Home = () => {
  const { products } = useProducts()
  const { selectedProduct, handleProductClick, handleClose } = useProductDialog()
  const { viewMode } = useViewMode()

  return (
    <>
      <section
        className={classNames({
          'home__products-grid': viewMode === 'card',
          'home__products-list': viewMode === 'list',
        })}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => handleProductClick(product)}
          />
        ))}
      </section>
      {selectedProduct && (
        <ProductDetail product={selectedProduct} onClose={handleClose} />
      )}
    </>
  )
}

export { Home }