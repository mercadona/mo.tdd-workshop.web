import { Outlet } from 'react-router-dom'

import { Layout } from 'system-ui/layout'

export const RootLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
