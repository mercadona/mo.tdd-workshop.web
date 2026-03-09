import './ProductCard.css'

export const ProductCard = () => {
  return (
    <article className="product-card product-card--card">
      <div className="product-card__image-wrapper">
        <img
          className="product-card__image"
          src="/images/aguacate-pieza-3830.jpg"
          alt="Aguacate"
        />
      </div>
      <div className="product-card__content">
        <h3 className="product-card__name">Aguacate</h3>
        <div className="product-card__footer">
          <span className="product-card__price">1,20 €</span>
        </div>
      </div>
    </article>
  )
}
