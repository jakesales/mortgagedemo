import { AlertCircle, AlertTriangle, Info } from 'lucide-react'
import type { Alert, AlertSeverity } from '../data/mockProperty'
import { WebhookActionButton } from '../context/WebhookFeedbackContext'
import { WebhookAction } from '../lib/webhook'

interface AlertsPanelProps {
  alerts: Alert[]
}

const severityConfig: Record<
  AlertSeverity,
  { icon: typeof Info; border: string; bg: string; iconColor: string }
> = {
  info: {
    icon: Info,
    border: 'border-border',
    bg: 'bg-canvas',
    iconColor: 'text-accent',
  },
  warning: {
    icon: AlertTriangle,
    border: 'border-warning/30',
    bg: 'bg-warning-soft',
    iconColor: 'text-warning',
  },
  critical: {
    icon: AlertCircle,
    border: 'border-critical/30',
    bg: 'bg-critical-soft',
    iconColor: 'text-critical',
  },
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <section
      id="alerts-section"
      className="scroll-mt-20 rounded-lg border border-border bg-surface"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-5">
        <div>
          <p className="text-sm font-bold text-ink">Alerts & actions</p>
          <p className="mt-0.5 text-xs text-ink-faint">
            Updates that may need your attention
          </p>
        </div>
        <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
          {alerts.length}
        </span>
      </div>

      <ul className="divide-y divide-border">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity]
          const Icon = config.icon

          return (
            <li key={alert.id} className="px-4 py-3 sm:px-5 sm:py-4">
              <div
                className={`flex gap-3 rounded-md border p-3 sm:p-3.5 ${config.border} ${config.bg}`}
              >
                <Icon
                  className={`mt-0.5 h-4 w-4 shrink-0 ${config.iconColor}`}
                  strokeWidth={2}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-ink">
                      {alert.title}
                    </p>
                    <time className="shrink-0 text-xs text-ink-faint">
                      {alert.date}
                    </time>
                  </div>
                  <div className="mt-1 flex items-start justify-between gap-3">
                    <p className="min-w-0 flex-1 text-sm leading-relaxed text-ink-muted">
                      {alert.message}
                    </p>
                    <WebhookActionButton
                      action={WebhookAction.FIND_OUT_MORE_ALERT}
                      extra={{ alertId: alert.id }}
                      className="shrink-0 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:border-accent/40 hover:bg-accent-soft/40 hover:text-accent"
                    >
                      Find out more
                    </WebhookActionButton>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
