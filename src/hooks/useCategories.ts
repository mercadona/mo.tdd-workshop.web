import { useEffect, useState } from 'react'
import type { Category } from 'types'

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/categories')
      const data = await response.json()
      setCategories(data)
    }

    fetchCategories()
  }, [])

  return { categories }
}
