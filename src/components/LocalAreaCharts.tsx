import { useMemo } from 'react'

interface ChartPoint {
  label: string
  value: number
}

const PAD = { top: 10, right: 10, bottom: 26, left: 40 }
const W = 280
const H = 140

function buildLineChart(data: ChartPoint[]) {
  const values = data.map((d) => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  const points = data.map((d, i) => ({
    ...d,
    x: PAD.left + (i / (data.length - 1)) * innerW,
    y: PAD.top + innerH - ((d.value - min) / range) * innerH,
  }))

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${PAD.top + innerH} L ${points[0].x} ${PAD.top + innerH} Z`

  return { points, linePath, areaPath, min, max, innerH }
}

function buildBarChart(data: ChartPoint[]) {
  const values = data.map((d) => d.value)
  const max = Math.max(...values) || 1
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const barGap = 2
  const barW = innerW / data.length - barGap

  const bars = data.map((d, i) => {
    const h = (d.value / max) * innerH
    return {
      ...d,
      x: PAD.left + i * (barW + barGap),
      y: PAD.top + innerH - h,
      w: barW,
      h,
    }
  })

  return { bars, max, innerH }
}

export function AreaAveragePriceChart({
  data,
  areaName,
}: {
  data: ChartPoint[]
  areaName: string
}) {
  const chart = useMemo(() => buildLineChart(data), [data])
  const first = data[0]
  const last = data[data.length - 1]
  const pct = (((last.value - first.value) / first.value) * 100).toFixed(1)

  return (
    <div className="rounded-lg border border-border bg-canvas/50 p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
            Average price change
          </p>
          <p className="mt-0.5 text-[11px] text-ink-muted">{areaName}</p>
        </div>
        <p className="text-xs font-medium text-positive">+{pct}%</p>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Average property price trend in ${areaName}`}
      >
        {[chart.min, (chart.min + chart.max) / 2, chart.max].map((tick) => {
          const y =
            PAD.top +
            chart.innerH -
            ((tick - chart.min) / (chart.max - chart.min || 1)) * chart.innerH
          return (
            <text
              key={tick}
              x={PAD.left - 4}
              y={y + 3}
              textAnchor="end"
              className="fill-ink-faint text-[8px]"
            >
              £{Math.round(tick / 1000)}k
            </text>
          )
        })}
        <path d={chart.areaPath} className="fill-positive/15" />
        <path
          d={chart.linePath}
          fill="none"
          className="stroke-positive"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {chart.points.map(
          (p, i) =>
            (i === 0 || i === chart.points.length - 1 || i % 4 === 0) && (
              <text
                key={p.label}
                x={p.x}
                y={H - 6}
                textAnchor="middle"
                className="fill-ink-faint text-[7px]"
              >
                {p.label}
              </text>
            ),
        )}
      </svg>
    </div>
  )
}

export function SalesVolumeChart({
  data,
  areaName,
}: {
  data: ChartPoint[]
  areaName: string
}) {
  const chart = useMemo(() => buildBarChart(data), [data])
  const last = data[data.length - 1]
  const prev = data[data.length - 2]
  const volChange = prev
    ? (((last.value - prev.value) / prev.value) * 100).toFixed(0)
    : '0'

  return (
    <div className="rounded-lg border border-border bg-canvas/50 p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
            Volume of sales
          </p>
          <p className="mt-0.5 text-[11px] text-ink-muted">{areaName}</p>
        </div>
        <p className="text-xs font-medium text-ink-muted">
          <span className="font-semibold tabular-nums text-ink">{last.value}</span>{' '}
          last quarter
          {Number(volChange) >= 0 ? (
            <span className="text-positive"> (+{volChange}%)</span>
          ) : (
            <span className="text-critical"> ({volChange}%)</span>
          )}
        </p>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Property sales volume in ${areaName}`}
      >
        <line
          x1={PAD.left}
          y1={PAD.top + chart.innerH}
          x2={W - PAD.right}
          y2={PAD.top + chart.innerH}
          className="stroke-border"
          strokeWidth="1"
        />
        {chart.bars.map((b, i) => (
          <g key={b.label}>
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx="1"
              className={
                i === chart.bars.length - 1 ? 'fill-accent' : 'fill-accent/35'
              }
            />
            {(i === 0 || i === chart.bars.length - 1 || i % 4 === 0) && (
              <text
                x={b.x + b.w / 2}
                y={H - 6}
                textAnchor="middle"
                className="fill-ink-faint text-[7px]"
              >
                {b.label}
              </text>
            )}
          </g>
        ))}
        <text
          x={PAD.left - 4}
          y={PAD.top + 8}
          textAnchor="end"
          className="fill-ink-faint text-[8px]"
        >
          {chart.max}
        </text>
      </svg>
      <p className="mt-1 text-center text-[10px] text-ink-faint">
        Completed sales per quarter
      </p>
    </div>
  )
}
