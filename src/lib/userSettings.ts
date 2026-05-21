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
    return normalizeUserSettings({
      ...defaultUserSettings(),
      ...JSON.parse(raw),
    })
  } catch {
    return defaultUserSettings()
  }
}

/** Keep country code short (+44). Strip duplicate country digits from the national number. */
export function normalizeUserSettings(settings: UserSettings): UserSettings {
  const countryDigits = settings.countryCode.replace(/\D/g, '').slice(0, 4)
  const countryCode = countryDigits ? `+${countryDigits}` : '+44'

  let nationalDigits = settings.mobileNumber.replace(/\D/g, '')
  if (countryDigits && nationalDigits.startsWith(countryDigits)) {
    nationalDigits = nationalDigits.slice(countryDigits.length)
  }

  return {
    ...settings,
    firstName: settings.firstName.trim(),
    email: settings.email.trim(),
    countryCode,
    mobileNumber: nationalDigits,
  }
}

export function saveUserSettings(settings: UserSettings): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(normalizeUserSettings(settings)),
  )
}

export function formatMobile(settings: UserSettings): string {
  const { countryCode, mobileNumber } = normalizeUserSettings(settings)
  const countryDigits = countryCode.replace(/\D/g, '')
  const nationalDigits = mobileNumber.replace(/\D/g, '')

  if (!countryDigits && !nationalDigits) return ''
  if (!nationalDigits) return countryCode
  return `+${countryDigits}${nationalDigits}`
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
