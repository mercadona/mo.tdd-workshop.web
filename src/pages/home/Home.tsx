import { useEffect, useState } from 'react'

import { HomeClient } from 'app/home/client'
import { Product } from 'app/home/types'

const Home = () => {
  const [products, setProducts] = useState<Array<Product>>([])

  const getProducts = async () => {
    try {
      const products = await HomeClient.getProducts()
      if (products?.length > 0) {
        setProducts(products)
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getProducts()
  }, [])

  return (
    <div>
      <h1 className="home-title">Home</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  )
}

export { Home }
