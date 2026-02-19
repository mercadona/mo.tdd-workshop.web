import './ProductCard.css'

export const ProductCard = () => {
  return (
    <article className="product-card product-card--card">
      <div className="product-card__image-wrapper">
        <img
          className="product-card__image"
          src="/images/aceitunas-manzanilla-rellenas-anchoa-hacendado-pack-3-22910.jpg"
          alt="Aceitunas verdes rellenas de anchoa Hacendado"
        />
      </div>
      <div className="product-card__content">
        <h3 className="product-card__name">
          Aceitunas verdes rellenas de anchoa Hacendado
        </h3>
        <div className="product-card__footer">
          <span className="product-card__price">3,00 €</span>
        </div>
      </div>
    </article>
  )
}