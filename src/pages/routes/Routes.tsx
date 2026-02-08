import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { Home } from '../home'
import { NotFound } from '../not-found'
import { PATHS } from '../paths'

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route index path={PATHS.HOME} element={<Home />} />
        <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </Router>
  )
}
