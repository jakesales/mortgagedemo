import { WebhookActionButton } from '../context/WebhookFeedbackContext'
import { WebhookAction } from '../lib/webhook'

export function SellingAdviceCta() {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex flex-col gap-4 px-4 py-5 min-[520px]:flex-row min-[520px]:items-center min-[520px]:justify-between sm:px-6">
        <div className="min-w-0 min-[520px]:max-w-xl">
          <p className="text-sm font-bold text-ink">
            Considering selling your property?
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Discuss your options with our advisory team — from comparable
            evidence and local market trends to timing your sale.
          </p>
        </div>
        <WebhookActionButton
          action={WebhookAction.CONTACT_ME_SELLING}
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent/90 min-[520px]:self-center"
        >
          Contact me
        </WebhookActionButton>
      </div>
    </section>
  )
}
