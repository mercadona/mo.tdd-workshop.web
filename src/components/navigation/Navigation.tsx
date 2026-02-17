import { NavLink } from 'react-router-dom'
import classNames from 'classnames'
import { Toggle } from 'components/toggle'
import { useCategories } from 'hooks/useCategories'
import { useViewMode } from 'hooks/useViewMode'
import './Navigation.css'

export const Navigation = () => {
  const { categories } = useCategories()
  const { viewMode, toggleViewMode } = useViewMode()

  return (
    <nav className="navigation">
      <div className="navigation__container">
        <h1 className="navigation__title">TDD Workshop</h1>
        <Toggle
          checked={viewMode === 'list'}
          onChange={toggleViewMode}
          label={
            viewMode === 'card' ? 'Vista como tarjeta' : 'Vista como lista'
          }
        />
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
