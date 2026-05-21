import { useEffect, useState } from 'react'
import type { AppPage } from './components/AppTabs'
import { Header } from './components/Header'
import { SettingsModal } from './components/SettingsModal'
import { UserSettingsProvider } from './context/UserSettingsContext'
import { WebhookFeedbackProvider } from './context/WebhookFeedbackContext'
import { mockProperty } from './data/mockProperty'
import { scrollToAlertsSection } from './lib/scrollToAlerts'
import { LocalAreaPage } from './pages/LocalAreaPage'
import { MyPropertyPage } from './pages/MyPropertyPage'
import { OverviewPage } from './pages/OverviewPage'

export default function App() {
  const [page, setPage] = useState<AppPage>('overview')
  const [pendingScrollToAlerts, setPendingScrollToAlerts] = useState(false)

  const alertCount = mockProperty.alerts.length

  const nav = { activePage: page, onNavigate: setPage }

  const handleNotificationsClick = () => {
    if (page !== 'overview') {
      setPage('overview')
      setPendingScrollToAlerts(true)
    } else {
      scrollToAlertsSection()
    }
  }

  useEffect(() => {
    if (page === 'overview' && pendingScrollToAlerts) {
      const timer = window.setTimeout(() => {
        scrollToAlertsSection()
        setPendingScrollToAlerts(false)
      }, 50)
      return () => window.clearTimeout(timer)
    }
  }, [page, pendingScrollToAlerts])

  return (
    <UserSettingsProvider>
      <WebhookFeedbackProvider>
        <Header
          alertCount={alertCount}
          onNotificationsClick={handleNotificationsClick}
        />
        <SettingsModal />
        {page === 'overview' && <OverviewPage {...nav} />}
        {page === 'local-area' && <LocalAreaPage {...nav} />}
        {page === 'my-property' && <MyPropertyPage {...nav} />}
      </WebhookFeedbackProvider>
    </UserSettingsProvider>
  )
}
