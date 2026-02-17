import { ProductCard } from 'components/product-card'
import { useProducts } from 'hooks/useProducts'
import './Home.css'

const Home = () => {
  const { products } = useProducts()

  return (
    <div>
      <div className="home__products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export { Home }
