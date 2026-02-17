import { Outlet } from 'react-router-dom'
import { Navigation } from 'components/navigation'
import { Layout } from 'components/layout'
import { Toggle } from 'components/toggle'
import { useViewMode } from 'hooks/useViewMode'

export const RootLayout = () => {
  const { viewMode, toggleViewMode } = useViewMode()

  return (
    <>
      <header>
        <Navigation />
        <Toggle
          checked={viewMode === 'list'}
          onChange={toggleViewMode}
          label={
            viewMode === 'card' ? 'Vista como tarjeta' : 'Vista como lista'
          }
        />
      </header>
      <main>
        <Layout>
          <Outlet />
        </Layout>
      </main>
    </>
  )
}
