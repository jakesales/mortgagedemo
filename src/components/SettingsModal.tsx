import { useEffect, useId, useState, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { useUserSettings } from '../context/UserSettingsContext'
import {
  mobileDigitsForInput,
  normalizeUserSettings,
  parseMobileDigits,
  type UserSettings,
} from '../lib/userSettings'

function FieldLabel({
  id,
  children,
}: {
  id: string
  children: ReactNode
}) {
  return (
    <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-ink-faint">
      {children}
    </label>
  )
}

const inputClassName =
  'mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent focus:ring-2 focus:ring-accent/20'

export function SettingsModal() {
  const { settings, settingsOpen, closeSettings, updateSettings } = useUserSettings()
  const titleId = useId()
  const [draft, setDraft] = useState<UserSettings>(settings)

  useEffect(() => {
    if (settingsOpen) {
      setDraft(settings)
    }
  }, [settingsOpen, settings])

  useEffect(() => {
    if (!settingsOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSettings()
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [settingsOpen, closeSettings])

  if (!settingsOpen) return null

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    updateSettings(
      normalizeUserSettings({
        ...draft,
        firstName: draft.firstName,
        email: draft.email,
      }),
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close settings"
        onClick={closeSettings}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-border bg-surface shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5 sm:px-5">
          <h2 id={titleId} className="text-sm font-bold text-ink">
            Your details
          </h2>
          <button
            type="button"
            onClick={closeSettings}
            className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-canvas hover:text-ink"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={2.25} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
          <p className="text-sm leading-relaxed text-ink-muted">
            These details are sent when you use contact and enquiry buttons.
          </p>

          <div>
            <FieldLabel id="settings-first-name">First name</FieldLabel>
            <input
              id="settings-first-name"
              type="text"
              autoComplete="given-name"
              value={draft.firstName}
              onChange={(e) =>
                setDraft((d) => ({ ...d, firstName: e.target.value }))
              }
              className={inputClassName}
              placeholder="Jane"
            />
          </div>

          <div>
            <FieldLabel id="settings-email">Email address</FieldLabel>
            <input
              id="settings-email"
              type="email"
              autoComplete="email"
              value={draft.email}
              onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
              className={inputClassName}
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <FieldLabel id="settings-mobile">Mobile number</FieldLabel>
            <p className="mt-1 text-xs text-ink-muted">e.g. +447736736363</p>
            <div className="mt-1.5 flex">
              <span
                className="flex shrink-0 items-center rounded-l-lg border border-r-0 border-border bg-canvas px-3 py-2.5 text-sm font-semibold text-ink"
                aria-hidden
              >
                +
              </span>
              <input
                id="settings-mobile"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={mobileDigitsForInput(draft)}
                onChange={(e) => {
                  const parsed = parseMobileDigits(e.target.value)
                  setDraft((d) => ({ ...d, ...parsed }))
                }}
                className={`${inputClassName} mt-0 min-w-0 flex-1 rounded-l-none`}
                placeholder="447736736363"
              />
            </div>
            <p className="mt-1.5 text-xs text-ink-faint">
              UK numbers: include 44 or enter without the leading zero.
            </p>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={closeSettings}
              className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-canvas"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent/90"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
