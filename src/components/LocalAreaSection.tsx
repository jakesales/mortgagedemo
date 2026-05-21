import { AreaAveragePriceChart, SalesVolumeChart } from './LocalAreaCharts'

interface LocalAreaSectionProps {
  areaName: string
  averagePriceHistory: { label: string; value: number }[]
  salesVolume: { label: string; value: number }[]
}

export function LocalAreaSection({
  areaName,
  averagePriceHistory,
  salesVolume,
}: LocalAreaSectionProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="border-b border-border bg-canvas/40 px-4 py-3.5 sm:px-5">
        <p className="text-sm font-bold text-ink">Local area</p>
        <p className="mt-0.5 text-xs text-ink-faint">
          Market trends in {areaName}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 min-[520px]:grid-cols-2 sm:p-5">
        <AreaAveragePriceChart
          data={averagePriceHistory}
          areaName={areaName}
        />
        <SalesVolumeChart data={salesVolume} areaName={areaName} />
      </div>
    </section>
  )
}
