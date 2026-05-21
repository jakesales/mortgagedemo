import type { AppPage } from './AppTabs'
import { PropertyValueChart } from './PropertyValueChart'
import { QuarterlyChange } from './QuarterlyChange'
import { formatGBP } from '../lib/format'

interface PropertyValueSectionProps {
  value: number
  valueChangeQuarter: { amount: number; percent: number }
  valueHistory: { label: string; value: number }[]
  onNavigate: (page: AppPage) => void
}

export function PropertyValueSection({
  value,
  valueChangeQuarter,
  valueHistory,
  onNavigate,
}: PropertyValueSectionProps) {
  return (
    <section className="rounded-lg border border-accent/25 bg-surface ring-1 ring-accent/10">
      <div className="grid grid-cols-1 min-[520px]:grid-cols-2">
        <div className="border-b border-border px-4 py-5 min-[520px]:border-b-0 min-[520px]:border-r min-[520px]:px-6 min-[520px]:py-6">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
            Estimated property value
          </p>
          <p className="mt-2 text-4xl font-bold tabular-nums tracking-tight text-ink sm:text-[2.75rem]">
            {formatGBP(value)}
          </p>
          <div className="mt-3">
            <QuarterlyChange {...valueChangeQuarter} />
          </div>
          <button
            type="button"
            onClick={() => onNavigate('local-area')}
            className="mt-4 w-full rounded-md border border-accent/40 bg-accent-soft/40 px-4 py-2.5 text-sm font-semibold text-accent transition-colors hover:border-accent hover:bg-accent-soft sm:w-auto"
          >
            Understand demand in your area
          </button>
        </div>

        <div className="px-4 py-4 min-[520px]:px-5 min-[520px]:py-5">
          <PropertyValueChart data={valueHistory} />
        </div>
      </div>
    </section>
  )
}
