import { TrendingUp } from 'lucide-react'
import { formatPercent, formatSignedGBP } from '../lib/format'

interface QuarterlyChangeProps {
  amount: number
  percent: number
}

export function QuarterlyChange({ amount, percent }: QuarterlyChangeProps) {
  const isPositive = amount >= 0

  return (
    <div
      className={`inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-md px-2.5 py-1.5 text-sm font-medium ${
        isPositive
          ? 'bg-positive-soft text-positive'
          : 'bg-critical-soft text-critical'
      }`}
    >
      <TrendingUp
        className={`h-3.5 w-3.5 ${!isPositive ? 'rotate-180' : ''}`}
      />
      <span className="font-semibold tabular-nums">{formatSignedGBP(amount)}</span>
      <span className="text-ink-faint">·</span>
      <span>{formatPercent(percent)}</span>
      <span className="font-normal text-ink-muted">in the last quarter</span>
    </div>
  )
}
