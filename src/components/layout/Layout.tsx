import type { ReactNode } from 'react'

import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return <div className="layout">{children}</div>
}
