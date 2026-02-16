import { useCategories } from 'hooks/useCategories'
import './Navigation.css'

export const Navigation = () => {
  const { categories } = useCategories()

  return (
    <nav className="navigation">
      <div className="navigation__container">
        <h1 className="navigation__title">TDD Workshop</h1>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>{category.displayName}</li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
