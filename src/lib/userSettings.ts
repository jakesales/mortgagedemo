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

/** Blank form when opening settings (new entry each time). */
export function emptySettingsForm(): UserSettings {
  return defaultUserSettings()
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

/** Parse digits from one mobile field (e.g. 447736736363 or 07736736363). */
export function parseMobileDigits(allDigits: string): {
  countryCode: string
  mobileNumber: string
} {
  let digits = allDigits.replace(/\D/g, '')

  if (digits.startsWith('00')) {
    digits = digits.slice(2)
  }
  if (digits.startsWith('0')) {
    return { countryCode: '+44', mobileNumber: digits.slice(1) }
  }
  if (digits.startsWith('44')) {
    return { countryCode: '+44', mobileNumber: digits.slice(2) }
  }
  if (digits.length > 0) {
    return { countryCode: '+44', mobileNumber: digits }
  }
  return { countryCode: '+44', mobileNumber: '' }
}

export function mobileDigitsForInput(settings: UserSettings): string {
  const { countryCode, mobileNumber } = normalizeUserSettings(settings)
  const country = countryCode.replace(/\D/g, '')
  const national = mobileNumber.replace(/\D/g, '')
  if (!national) return country === '44' ? '' : country
  return `${country}${national}`
}

/** Keep country code short (+44). Strip duplicate country digits from the national number. */
export function normalizeUserSettings(settings: UserSettings): UserSettings {
  const allDigits = `${settings.countryCode}${settings.mobileNumber}`.replace(
    /\D/g,
    '',
  )
  const parsed = parseMobileDigits(allDigits)

  return {
    ...settings,
    firstName: settings.firstName.trim(),
    email: settings.email.trim(),
    countryCode: parsed.countryCode,
    mobileNumber: parsed.mobileNumber,
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
