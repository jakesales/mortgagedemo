import type { EpcRating } from '../data/mockProperty'

const BANDS: EpcRating[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

const bandStyles: Record<
  EpcRating,
  { bar: string; label: string; activeText: string }
> = {
  A: { bar: 'bg-[#007f3b]', label: 'Very efficient', activeText: 'text-[#007f3b]' },
  B: { bar: 'bg-[#19b459]', label: 'Efficient', activeText: 'text-[#19b459]' },
  C: { bar: 'bg-[#8dce46]', label: 'Average', activeText: 'text-[#5a9a2e]' },
  D: { bar: 'bg-[#ffd500]', label: 'Below average', activeText: 'text-[#9a7b00]' },
  E: { bar: 'bg-[#fcaa65]', label: 'Poor', activeText: 'text-[#c76a20]' },
  F: { bar: 'bg-[#ef8023]', label: 'Very poor', activeText: 'text-[#c45f10]' },
  G: { bar: 'bg-[#e9153b]', label: 'Least efficient', activeText: 'text-[#c40f32]' },
}

interface EpcRatingDisplayProps {
  rating: EpcRating
  assessmentDate: string
}

export function EpcRatingDisplay({
  rating,
  assessmentDate,
}: EpcRatingDisplayProps) {
  const active = bandStyles[rating]

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
          Energy Performance Certificate (EPC)
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          Certificate dated {assessmentDate}
        </p>
      </div>

      <div className="flex items-stretch gap-4">
        <div
          className="flex w-full max-w-[220px] flex-col gap-0.5"
          role="img"
          aria-label={`EPC rating ${rating}, ${active.label}`}
        >
          {BANDS.map((band) => {
            const isActive = band === rating
            const width =
              band === 'A'
                ? 'w-[42%]'
                : band === 'B'
                  ? 'w-[50%]'
                  : band === 'C'
                    ? 'w-[58%]'
                    : band === 'D'
                      ? 'w-[66%]'
                      : band === 'E'
                        ? 'w-[74%]'
                        : band === 'F'
                          ? 'w-[82%]'
                          : 'w-[90%]'

            return (
              <div
                key={band}
                className={`flex h-7 items-center sm:h-8 ${
                  isActive ? 'relative z-10' : 'opacity-55'
                }`}
              >
                <div
                  className={`flex h-full ${width} items-center justify-between rounded-sm px-2.5 ${bandStyles[band].bar} ${
                    isActive ? 'ring-2 ring-ink/20 ring-offset-2' : ''
                  }`}
                >
                  <span
                    className={`text-sm font-bold ${
                      band === 'D' || band === 'C'
                        ? 'text-ink'
                        : 'text-white'
                    }`}
                  >
                    {band}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex shrink-0 flex-col justify-center">
          <p
            className={`text-6xl font-bold leading-none tracking-tight sm:text-7xl ${active.activeText}`}
          >
            {rating}
          </p>
          <p className="mt-2 max-w-[8rem] text-sm font-semibold text-ink">
            {active.label}
          </p>
        </div>
      </div>
    </div>
  )
}
