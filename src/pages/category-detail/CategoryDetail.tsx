import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ProductCard } from 'components/product-card'
import { Layout } from 'components/layout'
import type { Category, Product } from 'types'
import './CategoryDetail.css'

type CategoryWithProducts = Category & { products: Product[] }

export const CategoryDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const [category, setCategory] = useState<CategoryWithProducts | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchCategory = async () => {
      const response = await fetch(`/categories/${slug}`)

      if (!response.ok) {
        setNotFound(true)
        return
      }

      const data = await response.json()
      setCategory(data)
    }

    fetchCategory()
  }, [slug])

  if (notFound) {
    return (
      <Layout>
        <div className="category-detail">
          <p>Categoría no encontrada</p>
        </div>
      </Layout>
    )
  }

  if (!category) {
    return null
  }

  return (
    <Layout>
      <div className="category-detail">
        <div className="category-detail__header">
          <h1 className="category-detail__title">{category.displayName}</h1>
        </div>
        <div className="category-detail__products">
          {category.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Layout>
  )
}
