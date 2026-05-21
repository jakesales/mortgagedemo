import { useMemo, useState, type ReactNode } from 'react'
import { ArrowDown, Clock, RefreshCw } from 'lucide-react'
import {
  formatDurationMonths,
  formatTerm,
  fromTotalMonths,
  monthlyPayment,
  monthsSaved,
  termMonthsFromPayment,
  toTotalMonths,
} from '../lib/mortgage'
import { formatGBP, formatPercent } from '../lib/format'
import { WebhookActionButton } from '../context/WebhookFeedbackContext'
import { WebhookAction } from '../lib/webhook'

interface MortgageSectionProps {
  balance: number
  currentRate: number
  currentType: string
  dealRemainingMonths: number
  currentTermYears: number
  currentTermMonths: number
  offerRate: number
  offerType: string
  offerTermYears: number
  offerTermMonths: number
  ltv: number
}

function ColumnShell({
  title,
  subtitle,
  accent,
  compact,
  className = '',
  children,
}: {
  title: string
  subtitle: string
  accent?: boolean
  compact?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={`flex h-full min-w-0 flex-col overflow-hidden rounded-lg border ${
        accent
          ? 'border-accent/25 bg-accent-soft'
          : 'border-border bg-surface'
      } ${className}`}
    >
      <div
        className={`shrink-0 border-b px-4 ${compact ? 'py-3' : 'py-3.5'} ${
          accent
            ? 'border-accent/20 bg-accent-soft'
            : 'border-border bg-canvas/40'
        }`}
      >
        <p className="text-sm font-bold leading-snug text-ink">{title}</p>
        <p className="mt-0.5 text-xs text-ink-muted">{subtitle}</p>
      </div>
      <div
        className={`flex min-h-0 flex-1 flex-col px-4 ${
          compact ? 'py-2' : 'py-1'
        } ${accent ? 'bg-accent-soft [&_.border-border]:border-accent/25' : ''}`}
      >
        {children}
      </div>
    </div>
  )
}

function MortgageMetricRow({
  label,
  value,
  hint,
  distributed,
}: {
  label: string
  value: ReactNode
  hint?: string
  distributed?: boolean
}) {
  return (
    <div
      className={
        distributed
          ? 'flex min-h-0 flex-1 flex-col justify-center border-b border-border py-3 last:border-b-0'
          : 'border-b border-border py-2 last:border-b-0 last:pb-0 first:pt-0'
      }
    >
      <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
        {label}
      </p>
      <p className="mt-0.5 tabular-nums text-lg font-semibold tracking-tight text-ink">
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-ink-muted">{hint}</p>}
    </div>
  )
}

export function MortgageSection({
  balance,
  currentRate,
  currentType,
  dealRemainingMonths,
  currentTermYears,
  currentTermMonths,
  offerRate,
  offerType,
  offerTermYears,
  offerTermMonths,
  ltv,
}: MortgageSectionProps) {
  const [keepSamePayments, setKeepSamePayments] = useState(false)

  const currentTermTotal = toTotalMonths(currentTermYears, currentTermMonths)
  const offerTermTotal = toTotalMonths(offerTermYears, offerTermMonths)

  const calculations = useMemo(() => {
    const currentPayment = monthlyPayment(
      balance,
      currentRate,
      currentTermTotal,
    )

    const offerPaymentSameTerm = monthlyPayment(
      balance,
      offerRate,
      offerTermTotal,
    )

    const offerTermIfSamePayment = termMonthsFromPayment(
      balance,
      offerRate,
      currentPayment,
    )

    const saved = monthsSaved(currentTermTotal, offerTermIfSamePayment)
    const savedTerm = fromTotalMonths(saved)

    return {
      currentPayment,
      offerPaymentSameTerm,
      offerTermIfSamePayment,
      saved,
      savedTerm,
    }
  }, [
    balance,
    currentRate,
    currentTermTotal,
    offerRate,
    offerTermTotal,
  ])

  const displayOfferPayment = keepSamePayments
    ? calculations.currentPayment
    : calculations.offerPaymentSameTerm

  const displayOfferTerm = keepSamePayments
    ? fromTotalMonths(calculations.offerTermIfSamePayment)
    : { years: offerTermYears, months: offerTermMonths }

  const rateSaving = currentRate - offerRate
  const monthlySaving = calculations.currentPayment - displayOfferPayment

  return (
    <div className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-5 min-[520px]:items-stretch">
        <ColumnShell
          title="Your mortgage"
          subtitle="Your current mortgage product"
          compact
          className="min-[520px]:col-span-2"
        >
          <div className="flex min-h-0 flex-1 flex-col">
          <MortgageMetricRow
            distributed
            label="Mortgage balance"
            value={
              <>
                {formatGBP(balance)}
                <span className="ml-2 text-base font-normal text-ink-muted">
                  (LTV {formatPercent(ltv)})
                </span>
              </>
            }
            hint="Outstanding balance"
          />
          <MortgageMetricRow
            distributed
            label="Interest rate"
            value={
              <>
                {formatPercent(currentRate, 2)}
                <span className="ml-1 text-base font-normal text-ink-muted">
                  p.a.
                </span>
              </>
            }
          />
          <MortgageMetricRow distributed label="Product type" value={currentType} />
          <MortgageMetricRow
            distributed
            label="Fixed-rate period remaining"
            value={formatDurationMonths(dealRemainingMonths)}
          />
          <MortgageMetricRow
            distributed
            label="Remaining mortgage term"
            value={formatTerm(currentTermYears, currentTermMonths)}
          />
          <MortgageMetricRow
            distributed
            label="Current monthly repayment"
            value={formatGBP(calculations.currentPayment)}
            hint="Capital and interest"
          />
          </div>
        </ColumnShell>

        <ColumnShell
          title="Jason has found a remortgage option for you"
          subtitle="Illustrative example — not a formal offer"
          accent
          className="min-[520px]:col-span-3"
        >
          <div className="flex min-h-0 flex-1 flex-col justify-between">
          <div>
          <div className="border-b border-accent/25 py-3.5">
            <div className="grid grid-cols-2 gap-3 rounded-md border border-accent/20 bg-surface/90 p-3 shadow-sm">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
                  Offer rate
                </p>
                <p className="mt-1 tabular-nums text-lg font-semibold tracking-tight text-ink sm:text-xl">
                  {formatPercent(offerRate, 2)}
                  <span className="ml-1 text-base font-normal text-ink-muted">
                    p.a.
                  </span>
                </p>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-positive-soft px-2 py-0.5 text-xs font-semibold text-positive">
                  <ArrowDown className="h-3 w-3" />
                  {formatPercent(rateSaving, 2)} lower
                </span>
              </div>
              <div className="min-w-0 border-l border-border pl-3">
                <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
                  Product type
                </p>
                <p className="mt-1 text-lg font-semibold leading-snug tracking-tight text-ink sm:text-xl">
                  {offerType}
                </p>
              </div>
            </div>
          </div>
          <div className="py-3.5">
            <div className="grid grid-cols-2 gap-3 rounded-md border border-accent/20 bg-surface/90 p-3 shadow-sm">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
                  Monthly payment
                </p>
                <p
                  className={`mt-1 tabular-nums text-lg font-semibold tracking-tight sm:text-xl ${
                    keepSamePayments ? 'text-ink' : 'text-positive'
                  }`}
                >
                  {formatGBP(displayOfferPayment)}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  {keepSamePayments
                    ? 'Same as your current payment'
                    : 'Based on the illustrative rate'}
                </p>
              </div>
              <div className="min-w-0 border-l border-border pl-3">
                <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
                  Remaining mortgage term
                </p>
                <p
                  className={`mt-1 text-lg font-semibold tracking-tight sm:text-xl ${
                    keepSamePayments ? 'text-positive' : 'text-ink'
                  }`}
                >
                  {formatTerm(displayOfferTerm.years, displayOfferTerm.months)}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  {keepSamePayments
                    ? 'Based on the illustrative rate'
                    : 'Same term as your current mortgage'}
                </p>
              </div>
            </div>
          </div>
          </div>

          <div className="shrink-0 pt-3">
            <button
              type="button"
              onClick={() => setKeepSamePayments((on) => !on)}
              aria-pressed={keepSamePayments}
              className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
                keepSamePayments
                  ? 'border-brand-slate bg-brand-slate text-white'
                  : 'border-brand-slate/35 bg-brand-slate-soft text-brand-slate hover:border-brand-slate/55 hover:bg-brand-slate-soft'
              }`}
            >
              <RefreshCw
                className={`h-4 w-4 shrink-0 ${keepSamePayments ? 'text-white' : 'text-brand-slate'}`}
                strokeWidth={2.25}
              />
              {keepSamePayments
                ? 'Lower your monthly repayments'
                : 'Shorten your mortgage term'}
            </button>
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              {keepSamePayments
                ? 'Click to switch back to a lower monthly payment at the offer rate.'
                : 'Keep your current payment and see how much sooner you could be mortgage-free.'}
            </p>

            {((!keepSamePayments && monthlySaving > 0) ||
              (keepSamePayments && calculations.saved > 0)) && (
              <div className="mt-3 flex items-center justify-between gap-3 rounded-md border border-positive/30 bg-positive-soft p-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  {!keepSamePayments ? (
                    <ArrowDown className="h-4 w-4 shrink-0 text-positive" />
                  ) : (
                    <Clock className="h-4 w-4 shrink-0 text-positive" />
                  )}
                  <p className="text-base font-bold leading-tight tabular-nums text-positive">
                    {!keepSamePayments ? (
                      <>
                        <span className="block">Save {formatGBP(monthlySaving)}</span>
                        <span className="block text-sm font-semibold">a month</span>
                      </>
                    ) : (
                      <>
                        {formatTerm(
                          calculations.savedTerm.years,
                          calculations.savedTerm.months,
                        )}{' '}
                        sooner
                      </>
                    )}
                  </p>
                </div>
                <WebhookActionButton
                  action={
                    keepSamePayments
                      ? WebhookAction.CLAIM_OFFER_REDUCE_TERM
                      : WebhookAction.CLAIM_OFFER_REDUCE_PAYMENT
                  }
                  className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white hover:bg-accent/90"
                >
                  Claim offer
                </WebhookActionButton>
              </div>
            )}
          </div>
          </div>
        </ColumnShell>
    </div>
  )
}
