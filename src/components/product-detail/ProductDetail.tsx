import { NutriScore } from 'components/nutri-score'
import './ProductDetail.css'

export const ProductDetail = () => {
  return (
    <>
      <div className="product-detail__overlay" />
      <dialog open className="product-detail">
        <div className="product-detail__content">
          <button className="product-detail__close" aria-label="Cerrar">
            ×
          </button>
          <img
            src="/images/aceitunas-manzanilla-rellenas-anchoa-hacendado-pack-3-22910.jpg"
            alt="Aceitunas verdes rellenas de anchoa Hacendado"
            className="product-detail__image"
          />
          <h2 className="product-detail__name">
            Aceitunas verdes rellenas de anchoa Hacendado
          </h2>
          <p className="product-detail__price">3,00 €</p>
          <p className="product-detail__description">
            Aceitunas verdes rellenas con anchoas de calidad. Perfectas para el
            aperitivo.
          </p>
          <div className="product-detail__nutriscore">
            <NutriScore score="D" />
          </div>
        </div>
      </dialog>
    </>
  )
}
