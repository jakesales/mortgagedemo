import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'
import { CheckCircle } from 'lucide-react'
import { triggerWebhook } from '../lib/webhook'

interface WebhookFeedbackContextValue {
  runWebhookAction: (
    action: string,
    extra?: Record<string, string>,
  ) => Promise<void>
}

const WebhookFeedbackContext = createContext<WebhookFeedbackContextValue | null>(
  null,
)

export function useWebhookAction(
  action: string,
  extra?: Record<string, string>,
) {
  const { runWebhookAction } = useWebhookFeedback()
  const [isPending, setIsPending] = useState(false)

  const onClick = useCallback(async () => {
    if (isPending) return
    setIsPending(true)
    try {
      await runWebhookAction(action, extra)
    } finally {
      setIsPending(false)
    }
  }, [action, extra, isPending, runWebhookAction])

  return { onClick, isPending }
}

export const webhookButtonFeedbackClass = (isPending: boolean) =>
  `transition-transform duration-150 active:scale-[0.98] ${
    isPending ? 'scale-[0.98] opacity-70' : ''
  }`

function ThankYouModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="thank-you-title"
        className="relative w-full max-w-sm overflow-hidden rounded-xl border border-border bg-surface p-6 text-center shadow-xl sm:p-8"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-positive-soft text-positive">
          <CheckCircle className="h-7 w-7" strokeWidth={2.25} />
        </div>
        <h2
          id="thank-you-title"
          className="mt-4 text-lg font-bold tracking-tight text-ink"
        >
          Thank you
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          We&apos;ve received your request and will be in contact shortly.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent/90"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export function WebhookFeedbackProvider({ children }: { children: ReactNode }) {
  const [thankYouOpen, setThankYouOpen] = useState(false)

  const runWebhookAction = useCallback(
    async (action: string, extra?: Record<string, string>) => {
      await triggerWebhook(action, extra)
      setThankYouOpen(true)
    },
    [],
  )

  const value = useMemo(() => ({ runWebhookAction }), [runWebhookAction])

  return (
    <WebhookFeedbackContext.Provider value={value}>
      {children}
      <ThankYouModal open={thankYouOpen} onClose={() => setThankYouOpen(false)} />
    </WebhookFeedbackContext.Provider>
  )
}

function useWebhookFeedback(): WebhookFeedbackContextValue {
  const context = useContext(WebhookFeedbackContext)
  if (!context) {
    throw new Error('useWebhookFeedback must be used within WebhookFeedbackProvider')
  }
  return context
}

interface WebhookActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  action: string
  extra?: Record<string, string>
}

export function WebhookActionButton({
  action,
  extra,
  className = '',
  children,
  ...props
}: WebhookActionButtonProps) {
  const { onClick, isPending } = useWebhookAction(action, extra)

  return (
    <button
      type="button"
      {...props}
      onClick={onClick}
      disabled={isPending || props.disabled}
      aria-busy={isPending}
      className={`${webhookButtonFeedbackClass(isPending)} ${className}`.trim()}
    >
      {isPending ? 'Sending…' : children}
    </button>
  )
}
