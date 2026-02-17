import { Route, Routes } from 'react-router-dom'

import { CategoryDetail } from '../category-detail'
import { Home } from '../home'
import { NotFound } from '../not-found'
import { PATHS } from '../paths'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route index path={PATHS.HOME} element={<Home />} />
      <Route path={PATHS.CATEGORY_DETAIL} element={<CategoryDetail />} />
      <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
    </Routes>
  )
}
