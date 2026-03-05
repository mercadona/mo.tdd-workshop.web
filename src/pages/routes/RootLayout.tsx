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
      <footer className="disclaimer">
        La información de los productos ha sido generada con IA y no refleja
        datos reales. Solo con fines de testing.
      </footer>
    </>
  )
}
