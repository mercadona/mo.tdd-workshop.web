import classNames from 'classnames'

import type { Product } from 'types'
import { useViewMode } from 'hooks/useViewMode'
import { NutriScore } from 'components/nutri-score'
import './ProductCard.css'

interface ProductCardProps {
  product: Product
  onClick?: () => void
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { id, displayName, price, image, nutriscore, description } = product
  const { viewMode } = useViewMode()
  const headingId = `product-heading-${id}`
  const isListView = viewMode === 'list'

  return (
    <article
      className={classNames('product-card', {
        'product-card--card': viewMode === 'card',
        'product-card--list': viewMode === 'list',
      })}
      aria-labelledby={headingId}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="product-card__image-wrapper">
        <img className="product-card__image" src={image} alt={displayName} />
      </div>
      <div className="product-card__content">
        <h3 id={headingId} className="product-card__name">
          {displayName}
        </h3>
        {isListView && description && (
          <p className="product-card__description">{description}</p>
        )}
        <div className="product-card__footer">
          <span className="product-card__price">{formatPrice(price)}</span>
          {isListView && nutriscore && <NutriScore score={nutriscore} />}
        </div>
      </div>
    </article>
  )
}