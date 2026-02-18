import type { Product } from 'types'
import { NutriScore } from 'components/nutri-score'
import './ProductDetail.css'

interface ProductDetailProps {
  product: Product
  onClose: () => void
}

export const ProductDetail = ({ product, onClose }: ProductDetailProps) => {
  const formattedPrice = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(product.price)

  return (
    <>
      <div className="product-detail__overlay" onClick={onClose} />
      <dialog open className="product-detail">
        <div className="product-detail__content">
          <button
            onClick={onClose}
            className="product-detail__close"
            aria-label="Cerrar"
          >
            ×
          </button>
          <img
            src={product.image}
            alt={product.displayName}
            className="product-detail__image"
          />
          <h2 className="product-detail__name">{product.displayName}</h2>
          <p className="product-detail__price">{formattedPrice}</p>
          {product.description && (
            <p className="product-detail__description">{product.description}</p>
          )}
          {product.nutriscore && (
            <NutriScore score={product.nutriscore} showLabel />
          )}
        </div>
      </dialog>
    </>
  )
}
