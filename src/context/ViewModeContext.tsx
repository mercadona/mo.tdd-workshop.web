import { createContext, useState, type ReactNode } from 'react'

type ViewMode = 'card' | 'list'

interface ViewModeContextValue {
  viewMode: ViewMode
  toggleViewMode: () => void
}

const ViewModeContext = createContext<ViewModeContextValue | null>(null)

export const ViewModeProvider = ({ children }: { children: ReactNode }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('card')

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'card' ? 'list' : 'card'))
  }

  return (
    <ViewModeContext.Provider value={{ viewMode, toggleViewMode }}>
      {children}
    </ViewModeContext.Provider>
  )
}

export { ViewModeContext }
