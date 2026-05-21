import { Bath, BedDouble, Leaf, Ruler } from 'lucide-react'
import type { EpcRating } from '../data/mockProperty'
import { WebhookActionButton } from '../context/WebhookFeedbackContext'
import { WebhookAction } from '../lib/webhook'
import { EpcRatingDisplay } from './EpcRatingDisplay'

interface PropertyDetailsSectionProps {
  livingAreaSqm: number
  bedrooms: number
  bathrooms: number
  epcRating: EpcRating
  epcAssessmentDate: string
}

function PropertyStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BedDouble
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-canvas/50 px-4 py-3.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-brand-slate ring-1 ring-border">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
          {label}
        </p>
        <p className="mt-0.5 text-xl font-bold tabular-nums tracking-tight text-ink">
          {value}
        </p>
      </div>
    </div>
  )
}

export function PropertyDetailsSection({
  livingAreaSqm,
  bedrooms,
  bathrooms,
  epcRating,
  epcAssessmentDate,
}: PropertyDetailsSectionProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="grid grid-cols-1 min-[640px]:grid-cols-5">
        <div className="border-b border-border px-4 py-5 min-[640px]:col-span-2 min-[640px]:border-b-0 min-[640px]:border-r sm:px-6">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
            Property details
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <PropertyStat
              icon={Ruler}
              label="Internal floor area"
              value={`${livingAreaSqm} m²`}
            />
            <PropertyStat
              icon={BedDouble}
              label="Bedrooms"
              value={String(bedrooms)}
            />
            <PropertyStat
              icon={Bath}
              label="Bathrooms"
              value={String(bathrooms)}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-positive-soft/40 to-canvas px-4 py-5 min-[640px]:col-span-3 sm:px-6 sm:py-6">
          <EpcRatingDisplay
            rating={epcRating}
            assessmentDate={epcAssessmentDate}
          />
        </div>
      </div>

      <div className="border-t border-border bg-canvas/60 px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 min-[520px]:flex-row min-[520px]:items-center min-[520px]:justify-between">
          <div className="flex gap-3 min-[520px]:max-w-xl">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-positive-soft text-positive">
              <Leaf className="h-5 w-5" strokeWidth={2} />
            </div>
            <p className="text-sm leading-relaxed text-ink">
              Improved your home since your last EPC? A better EPC rating can
              unlock green mortgages.
            </p>
          </div>
          <WebhookActionButton
            action={WebhookAction.BOOK_EPC_ASSESSMENT}
            className="shrink-0 rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent/90 min-[520px]:self-center"
          >
            Book an EPC assessment
          </WebhookActionButton>
        </div>
      </div>
    </section>
  )
}
