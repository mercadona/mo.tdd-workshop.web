import { Link } from 'react-router-dom'
import { useCategories } from 'hooks/useCategories'
import './Navigation.css'

export const Navigation = () => {
  const { categories } = useCategories()

  return (
    <nav className="navigation">
      <div className="navigation__container">
        <h1 className="navigation__title">TDD Workshop</h1>
        <ul className="navigation__list">
          {categories.map((category) => (
            <li key={category.id} className="navigation__list-item">
              <Link to={`/categories/${category.slug}`}>
                {category.displayName}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
