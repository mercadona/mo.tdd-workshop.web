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
    </>
  )
}
