import { NavLink } from 'react-router-dom'
import classNames from 'classnames'
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
              <NavLink
                to={`/categories/${category.slug}`}
                className={({ isActive }) =>
                  classNames('navigation__link', {
                    'navigation__link--active': isActive,
                  })
                }
              >
                {category.displayName}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
