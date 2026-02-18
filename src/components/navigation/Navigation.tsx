import { useCategories } from 'hooks/useCategories'
import './Navigation.css'

export const Navigation = () => {
  const { categories } = useCategories()

  return (
    <nav className="navigation">
      <div className="navigation__container">
        <img
          src="/mercadona-logo.svg"
          alt="Mercadona"
          className="navigation__logo"
        />
        <ul className="navigation__list">
          {categories.map((category) => (
            <li key={category.id} className="navigation__list-item">
              {category.displayName}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
