import { formatGBP } from '../lib/format'
import { WebhookActionButton } from '../context/WebhookFeedbackContext'
import { WebhookAction } from '../lib/webhook'

interface EquitySectionProps {
  equity: number
}

export function EquitySection({ equity }: EquitySectionProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-ink text-white">
      <div className="grid grid-cols-1 min-[520px]:grid-cols-2">
        <div className="px-4 py-5 min-[520px]:border-r min-[520px]:border-white/15 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-wider text-white/60">
            Your equity
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight sm:text-4xl">
            {formatGBP(equity)}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            Property value minus your outstanding mortgage balance
          </p>
        </div>

        <div className="flex flex-col justify-center border-t border-white/15 px-4 py-5 min-[520px]:border-t-0 sm:px-6">
          <p className="text-sm leading-relaxed text-white/85">
            Your equity could be used for other goals. Speak to your broker to
            explore options.
          </p>
          <WebhookActionButton
            action={WebhookAction.CONTACT_BROKER_EQUITY}
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-white hover:bg-accent/90 sm:w-auto"
          >
            Contact your broker
          </WebhookActionButton>
        </div>
      </div>
    </section>
  )
}
