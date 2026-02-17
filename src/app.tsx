import { BrowserRouter as Router } from 'react-router-dom'
import { Layout } from 'components/layout'
import { Navigation } from 'components/navigation'
import { AppRoutes } from 'pages/routes'

export const App = () => {
  return (
    <Router>
      <header>
        <Navigation />
      </header>
      <main>
        <Layout>
          <AppRoutes />
        </Layout>
      </main>
    </Router>
  )
}
