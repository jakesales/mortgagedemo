export type AppPage = 'overview' | 'local-area' | 'my-property'

interface AppTabsProps {
  active: AppPage
  onChange: (page: AppPage) => void
  /** Inside map card; omit sticky bar layout. */
  embedded?: boolean
}

const tabs: { id: AppPage; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'local-area', label: 'Local area' },
  { id: 'my-property', label: 'My property' },
]

export function AppTabs({ active, onChange, embedded = false }: AppTabsProps) {
  return (
    <nav
      className={
        embedded
          ? 'border-b border-border bg-canvas/50'
          : 'sticky top-14 z-40 border-b border-border bg-surface'
      }
      aria-label="Main sections"
    >
      <div
        className={
          embedded ? 'flex' : 'mx-auto flex max-w-2xl min-[520px]:max-w-4xl lg:max-w-5xl lg:px-8'
        }
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-current={active === tab.id ? 'page' : undefined}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
              active === tab.id
                ? 'border-b-2 border-accent text-accent'
                : 'text-ink-muted hover:bg-canvas hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
