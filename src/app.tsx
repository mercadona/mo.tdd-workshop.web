import { Layout } from 'components/layout'
import { Navigation } from 'components/navigation'
import { AppRoutes } from 'pages/routes'

export const App = () => {
  return (
    <>
      <header>
        <Navigation />
      </header>
      <main>
        <Layout>
          <AppRoutes />
        </Layout>
      </main>
      <footer className="disclaimer">
        La información de los productos ha sido generada con IA y no refleja
        datos reales. Solo con fines de testing.
      </footer>
    </>
  )
}
