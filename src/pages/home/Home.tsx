import { ProductCard } from 'components/product-card'
import { useProducts } from 'hooks/useProducts'

const Home = () => {
  const { products } = useProducts()

  return (
    <div>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export { Home }
