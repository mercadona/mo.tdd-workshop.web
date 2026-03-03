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
            src="/images/aguacate-pieza-3830.jpg"
            alt="Aguacate"
            className="product-detail__image"
          />
          <h2 className="product-detail__name">Aguacate</h2>
          <p className="product-detail__price">1,20 €</p>
          <p className="product-detail__description">
            Aguacate cremoso y nutritivo. Rico en grasas saludables.
          </p>
        </div>
      </dialog>
    </>
  )
}
