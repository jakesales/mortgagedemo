import { Bell, Home, Settings } from 'lucide-react'
import { useUserSettings } from '../context/UserSettingsContext'

interface HeaderProps {
  alertCount: number
  onNotificationsClick: () => void
}

export function Header({ alertCount, onNotificationsClick }: HeaderProps) {
  const { openSettings } = useUserSettings()
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-3 px-4 min-[520px]:max-w-4xl lg:max-w-5xl lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-white">
            <Home className="h-4 w-4" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold tracking-tight text-ink sm:text-base">
              ABC Mortgage Broker
            </p>
            <p className="hidden text-xs text-ink-faint sm:block">
              Specialist self-employed mortgages
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={openSettings}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-ink-muted transition-colors hover:bg-canvas hover:text-ink"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" strokeWidth={2.25} />
          </button>

          <button
            type="button"
            onClick={onNotificationsClick}
            className="relative flex items-center gap-2 rounded-lg border border-border px-2.5 py-2 text-ink-muted transition-colors hover:bg-canvas hover:text-ink sm:px-3"
            aria-label={`Your notifications, ${alertCount} items`}
          >
            <Bell className="h-4 w-4 shrink-0" />
            <span className="hidden text-xs font-semibold text-ink sm:inline sm:text-sm">
              Your notifications
            </span>
            {alertCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                {alertCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
