export interface UserSettings {
  firstName: string
  email: string
  countryCode: string
  mobileNumber: string
}

const STORAGE_KEY = 'abc-mortgage-user-settings'

export function defaultUserSettings(): UserSettings {
  return {
    firstName: '',
    email: '',
    countryCode: '+44',
    mobileNumber: '',
  }
}

export function loadUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultUserSettings()
    return { ...defaultUserSettings(), ...JSON.parse(raw) }
  } catch {
    return defaultUserSettings()
  }
}

export function saveUserSettings(settings: UserSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

export function formatMobile(settings: UserSettings): string {
  const code = settings.countryCode.trim()
  const number = settings.mobileNumber.replace(/\s/g, '')
  if (!code && !number) return ''
  if (!code) return number
  if (!number) return code
  return `${code}${number}`
}

export function getContactWebhookParams(): Record<string, string> {
  const settings = loadUserSettings()
  const params: Record<string, string> = {}

  if (settings.firstName.trim()) {
    params.firstName = settings.firstName.trim()
  }
  if (settings.email.trim()) {
    params.email = settings.email.trim()
  }

  const mobile = formatMobile(settings)
  if (mobile) {
    params.mobile = mobile
  }

  return params
}
