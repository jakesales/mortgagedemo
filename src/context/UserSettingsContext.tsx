import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { loadUserSettings, saveUserSettings, type UserSettings } from '../lib/userSettings'

interface UserSettingsContextValue {
  settings: UserSettings
  settingsOpen: boolean
  openSettings: () => void
  closeSettings: () => void
  updateSettings: (settings: UserSettings) => void
}

const UserSettingsContext = createContext<UserSettingsContextValue | null>(null)

export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(loadUserSettings)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const openSettings = useCallback(() => setSettingsOpen(true), [])
  const closeSettings = useCallback(() => setSettingsOpen(false), [])

  const updateSettings = useCallback((next: UserSettings) => {
    saveUserSettings(next)
    setSettings(next)
    setSettingsOpen(false)
  }, [])

  const value = useMemo(
    () => ({
      settings,
      settingsOpen,
      openSettings,
      closeSettings,
      updateSettings,
    }),
    [settings, settingsOpen, openSettings, closeSettings, updateSettings],
  )

  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  )
}

export function useUserSettings(): UserSettingsContextValue {
  const context = useContext(UserSettingsContext)
  if (!context) {
    throw new Error('useUserSettings must be used within UserSettingsProvider')
  }
  return context
}
