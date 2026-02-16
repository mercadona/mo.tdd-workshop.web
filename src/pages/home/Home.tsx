import { useCategories } from 'hooks/useCategories'

const Home = () => {
  const { categories } = useCategories()

  return (
    <div>
      <h1>Hello World!</h1>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.displayName}</li>
        ))}
      </ul>
    </div>
  )
}

export { Home }
