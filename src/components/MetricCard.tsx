import type { ReactNode } from 'react'

interface MetricCardProps {
  label: string
  value: ReactNode
  sublabel?: ReactNode
  highlight?: boolean
  className?: string
}

export function MetricCard({
  label,
  value,
  sublabel,
  highlight = false,
  className = '',
}: MetricCardProps) {
  return (
    <article
      className={`flex flex-col justify-between rounded-lg border bg-surface p-5 ${
        highlight
          ? 'border-accent/25 ring-1 ring-accent/10'
          : 'border-border'
      } ${className}`}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
        {label}
      </p>
      <div className="mt-3">
        <div className="text-2xl font-bold tabular-nums tracking-tight text-ink sm:text-[1.65rem]">
          {value}
        </div>
        {sublabel && (
          <div className="mt-1.5 text-sm text-ink-muted">{sublabel}</div>
        )}
      </div>
    </article>
  )
}
