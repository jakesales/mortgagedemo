import type { ComparableSale } from '../data/mockProperty'
import { formatGBP } from '../lib/format'

function formatCompletionDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(y, m - 1, d))
}

interface ComparableSalesSectionProps {
  areaName: string
  sales: ComparableSale[]
}

function ComparableSaleCard({ sale }: { sale: ComparableSale }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-canvas">
        <img
          src={sale.imageUrl}
          alt={`${sale.line1}, typical London residential property`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col px-3.5 py-3.5 sm:px-4 sm:py-4">
        <address className="not-italic">
          <p className="text-sm font-semibold leading-snug text-ink">
            {sale.line1}
          </p>
          <p className="text-xs text-ink-muted">
            {sale.line2}
          </p>
          <p className="mt-0.5 text-xs font-semibold tabular-nums text-ink">
            {sale.postcode}
          </p>
        </address>
        <dl className="mt-3 space-y-2 border-t border-border pt-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-ink-faint">
              Sold price
            </dt>
            <dd className="mt-0.5 text-lg font-bold tabular-nums tracking-tight text-ink">
              {formatGBP(sale.soldPrice)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-ink-faint">
              Completion date
            </dt>
            <dd className="mt-0.5 text-sm font-medium text-ink">
              <time dateTime={sale.completionDate}>
                {formatCompletionDate(sale.completionDate)}
              </time>
            </dd>
          </div>
        </dl>
      </div>
    </article>
  )
}

export function ComparableSalesSection({
  areaName,
  sales,
}: ComparableSalesSectionProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="border-b border-border bg-canvas/40 px-4 py-3.5 sm:px-5">
        <p className="text-sm font-bold text-ink">Recent comparable sales</p>
        <p className="mt-0.5 text-xs text-ink-faint">
          Similar properties sold near {areaName} in the last 12 months
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 min-[520px]:grid-cols-2 lg:grid-cols-4 sm:p-5">
        {sales.map((sale) => (
          <ComparableSaleCard key={sale.id} sale={sale} />
        ))}
      </div>
    </section>
  )
}
