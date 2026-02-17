import { ViewModeProvider } from 'context/ViewModeContext'
import { AppRoutes } from 'pages/routes'

export const App = () => {
  return (
    <ViewModeProvider>
      <AppRoutes />
    </ViewModeProvider>
  )
}
