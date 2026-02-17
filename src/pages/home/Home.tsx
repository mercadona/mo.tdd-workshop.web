import classNames from 'classnames'
import { ProductCard } from 'components/product-card'
import { useProducts } from 'hooks/useProducts'
import { useViewMode } from 'hooks/useViewMode'
import './Home.css'

const Home = () => {
  const { products } = useProducts()
  const { viewMode } = useViewMode()

  return (
    <div>
      <div
        className={classNames({
          'home__products-grid': viewMode === 'card',
          'home__products-list': viewMode === 'list',
        })}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export { Home }
