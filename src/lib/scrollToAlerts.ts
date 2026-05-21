export const ALERTS_SECTION_ID = 'alerts-section'

export function scrollToAlertsSection() {
  document.getElementById(ALERTS_SECTION_ID)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}
