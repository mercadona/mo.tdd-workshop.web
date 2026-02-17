import classNames from 'classnames'
import { useParams } from 'react-router-dom'
import { ProductCard } from 'components/product-card'
import { useCategoryWithProducts } from 'hooks/useCategoryWithProducts'
import { useViewMode } from 'hooks/useViewMode'
import './CategoryDetail.css'

export const CategoryDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const { category, notFound } = useCategoryWithProducts(slug)
  const { viewMode } = useViewMode()

  if (notFound) {
    return (
      <div className="category-detail">
        <p>Categoría no encontrada</p>
      </div>
    )
  }

  if (!category) {
    return null
  }

  return (
    <div className="category-detail">
      <div className="category-detail__header">
        <h1 className="category-detail__title">{category.displayName}</h1>
      </div>
      <div
        className={classNames({
          'category-detail__products-grid': viewMode === 'card',
          'category-detail__products-list': viewMode === 'list',
        })}
      >
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
