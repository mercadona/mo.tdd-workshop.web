import { Outlet } from 'react-router-dom'
import { Navigation } from 'components/navigation'
import { Layout } from 'components/layout'

export const RootLayout = () => {
  return (
    <>
      <header>
        <Navigation />
      </header>
      <main>
        <Layout>
          <Outlet />
        </Layout>
      </main>
    </>
  )
}
