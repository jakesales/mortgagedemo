import { useMemo } from 'react'
import { formatGBP } from '../lib/format'

interface PropertyValueChartProps {
  data: { label: string; value: number }[]
}

const PAD = { top: 8, right: 8, bottom: 28, left: 44 }
const W = 320
const H = 160

export function PropertyValueChart({ data }: PropertyValueChartProps) {
  const chart = useMemo(() => {
    const values = data.map((d) => d.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1
    const innerW = W - PAD.left - PAD.right
    const innerH = H - PAD.top - PAD.bottom

    const points = data.map((d, i) => {
      const x = PAD.left + (i / (data.length - 1)) * innerW
      const y = PAD.top + innerH - ((d.value - min) / range) * innerH
      return { ...d, x, y }
    })

    const linePath = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ')

    const areaPath = `${linePath} L ${points[points.length - 1].x} ${PAD.top + innerH} L ${points[0].x} ${PAD.top + innerH} Z`

    const yTicks = [min, min + range * 0.5, max]

    return { points, linePath, areaPath, yTicks, min, max, innerH }
  }, [data])

  const first = data[0]
  const last = data[data.length - 1]
  const totalChange = last.value - first.value
  const totalPercent = ((totalChange / first.value) * 100).toFixed(1)

  return (
    <div className="flex h-full min-h-[168px] flex-col">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
          Estimated value trend
        </p>
        <p className="text-xs font-medium text-positive">
          +{totalPercent}% <span className="text-ink-faint">3 yrs</span>
        </p>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full flex-1"
        role="img"
        aria-label={`Property value chart from ${formatGBP(first.value)} to ${formatGBP(last.value)} over three years`}
      >
        {chart.yTicks.map((tick) => {
          const y =
            PAD.top +
            chart.innerH -
            ((tick - chart.min) / (chart.max - chart.min || 1)) * chart.innerH
          return (
            <g key={tick}>
              <line
                x1={PAD.left}
                y1={y}
                x2={W - PAD.right}
                y2={y}
                className="stroke-border"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <text
                x={PAD.left - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-ink-faint text-[9px]"
              >
                {tick >= 1_000_000
                  ? `£${(tick / 1_000_000).toFixed(2)}m`
                  : `£${Math.round(tick / 1000)}k`}
              </text>
            </g>
          )
        })}

        <path d={chart.areaPath} className="fill-accent/12" />
        <path
          d={chart.linePath}
          fill="none"
          className="stroke-accent"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {chart.points.map((p, i) => {
          const showXLabel =
            i === 0 || i === chart.points.length - 1 || i % 4 === 0
          return (
            <g key={p.label}>
              {showXLabel && (
                <text
                  x={p.x}
                  y={H - 8}
                  textAnchor="middle"
                  className="fill-ink-faint text-[8px]"
                >
                  {p.label}
                </text>
              )}
              {i === chart.points.length - 1 && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  className="fill-accent stroke-surface"
                  strokeWidth="2"
                />
              )}
            </g>
          )
        })}
      </svg>

      <p className="mt-1 text-center text-[10px] text-ink-faint">
        Last 3 years · quarterly estimates
      </p>
    </div>
  )
}
