import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'

import { Home } from '../home'
import { Login } from '../login'
import { NotFound } from '../not-found'
import { PATHS } from '../paths'
import { RootLayout } from './components/RootLayout'

const routesConfig: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      {
        index: true,
        path: PATHS.HOME,
        element: <Home />,
      },
      {
        path: PATHS.LOGIN,
        element: <Login />,
      },
      {
        path: PATHS.NOT_FOUND,
        element: <NotFound />,
      },
    ],
  },
]

const router = createBrowserRouter(routesConfig)

export const Routes = () => {
  return <RouterProvider router={router} />
}
