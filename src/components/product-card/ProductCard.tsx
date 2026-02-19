import type { Product } from 'types'
import './ProductCard.css'

interface ProductCardProps {
  product: Product
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { id, displayName, price, image } = product
  const headingId = `product-heading-${id}`

  return (
    <article
      className="product-card product-card--card"
      aria-labelledby={headingId}
    >
      <div className="product-card__image-wrapper">
        <img className="product-card__image" src={image} alt={displayName} />
      </div>
      <div className="product-card__content">
        <h3 id={headingId} className="product-card__name">
          {displayName}
        </h3>
        <div className="product-card__footer">
          <span className="product-card__price">{formatPrice(price)}</span>
        </div>
      </div>
    </article>
  )
}