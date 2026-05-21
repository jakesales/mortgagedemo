import { MapPin } from 'lucide-react'

interface HeatSpot {
  x: number
  y: number
  radius: number
  intensity: number
}

interface PropertyMapProps {
  lat: number
  lng: number
  postcode: string
  /** Fills parent container (e.g. 50% width column with fixed height). */
  fill?: boolean
}

/** Mock local value heat — design preview until live data is wired. */
const HEAT_SPOTS: HeatSpot[] = [
  { x: 38, y: 42, radius: 42, intensity: 0.95 },
  { x: 62, y: 55, radius: 36, intensity: 0.82 },
  { x: 22, y: 58, radius: 28, intensity: 0.55 },
  { x: 72, y: 32, radius: 30, intensity: 0.68 },
  { x: 48, y: 28, radius: 24, intensity: 0.45 },
  { x: 55, y: 68, radius: 32, intensity: 0.72 },
]

function heatColour(intensity: number): string {
  if (intensity >= 0.85) return '234, 88, 12'
  if (intensity >= 0.7) return '234, 179, 8'
  if (intensity >= 0.5) return '34, 197, 94'
  return '59, 130, 246'
}

function ValueHeatmap() {
  return (
    <div
      className="pointer-events-none absolute inset-0 mix-blend-multiply"
      aria-hidden
    >
      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {HEAT_SPOTS.map((spot, i) => (
          <circle
            key={i}
            cx={spot.x}
            cy={spot.y}
            r={spot.radius / 4}
            fill={`rgba(${heatColour(spot.intensity)}, ${0.35 + spot.intensity * 0.35})`}
            filter="url(#heatmap-blur)"
          />
        ))}
        <defs>
          <filter id="heatmap-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>
      </svg>
      <div
        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
        title="Your property"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent shadow-sm ring-2 ring-white">
          <MapPin className="h-3 w-3 text-white" strokeWidth={2.5} />
        </span>
      </div>
    </div>
  )
}

function HeatmapLegend({ small }: { small?: boolean }) {
  if (small) {
    return (
      <div
        className="absolute bottom-0.5 right-0.5 flex max-w-[72px] items-center gap-0.5 rounded px-1 py-px text-[6px] font-medium leading-none text-ink-muted ring-1 ring-border/60 bg-surface/85"
        aria-hidden
      >
        <span>L</span>
        <span
          className="h-0.5 w-6 shrink-0 rounded-full"
          style={{
            background:
              'linear-gradient(90deg, rgb(59,130,246), rgb(34,197,94), rgb(234,179,8), rgb(234,88,12))',
          }}
        />
        <span>H</span>
      </div>
    )
  }

  return (
    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1 rounded bg-surface/90 px-2 py-1 text-[9px] font-medium text-ink-muted ring-1 ring-border/80">
      <span>Low</span>
      <span
        className="h-1.5 flex-1 rounded-full"
        style={{
          background:
            'linear-gradient(90deg, rgb(59,130,246), rgb(34,197,94), rgb(234,179,8), rgb(234,88,12))',
        }}
      />
      <span>High</span>
    </div>
  )
}

export function PropertyMap({
  lat,
  lng,
  postcode,
  fill = false,
}: PropertyMapProps) {
  const delta = fill ? 0.0024 : 0.004
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik`

  return (
    <div
      className={`relative overflow-hidden rounded-md border border-border bg-canvas ${
        fill ? 'h-full w-full' : 'aspect-[4/3] w-full sm:aspect-[16/10]'
      }`}
    >
      <iframe
        title={`Map of ${postcode}`}
        src={mapUrl}
        className={`absolute border-0 grayscale contrast-[1.05] brightness-[0.92] ${
          fill
            ? 'left-0 top-0 h-[calc(100%+2rem)] w-full'
            : 'inset-0 h-full w-full'
        }`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <ValueHeatmap />
      <div className="pointer-events-none absolute inset-0 bg-ink/[0.03]" />
      <HeatmapLegend small={fill} />
    </div>
  )
}
