import { AppTabs, type AppPage } from './AppTabs'
import type { ReactNode } from 'react'

interface MapPageShellProps {
  activePage: AppPage
  onNavigate: (page: AppPage) => void
  children: ReactNode
}

/** Map block with main section menu tabs. */
export function MapPageShell({
  activePage,
  onNavigate,
  children,
}: MapPageShellProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface">
      <AppTabs active={activePage} onChange={onNavigate} embedded />
      <div className="p-4">{children}</div>
    </section>
  )
}
