import type { AppPage } from '../components/AppTabs'
import { ComparableSalesSection } from '../components/ComparableSalesSection'
import { SellingAdviceCta } from '../components/SellingAdviceCta'
import { LocalAreaSection } from '../components/LocalAreaSection'
import { MapPageShell } from '../components/MapPageShell'
import { PropertyMap } from '../components/PropertyMap'
import { mockProperty } from '../data/mockProperty'

interface LocalAreaPageProps {
  activePage: AppPage
  onNavigate: (page: AppPage) => void
}

export function LocalAreaPage({ activePage, onNavigate }: LocalAreaPageProps) {
  const p = mockProperty
  const areaName = `${p.address.line2}, ${p.address.city}`

  return (
    <main className="mx-auto max-w-2xl px-4 py-5 min-[520px]:max-w-4xl sm:py-6 lg:max-w-5xl lg:px-8">
      <div className="flex flex-col gap-4 sm:gap-5">
        <MapPageShell activePage={activePage} onNavigate={onNavigate}>
          <div className="h-[200px] w-full sm:h-[240px]">
            <PropertyMap
              lat={p.coordinates.lat}
              lng={p.coordinates.lng}
              postcode={p.address.postcode}
              fill
            />
          </div>
        </MapPageShell>

        <LocalAreaSection
          areaName={areaName}
          averagePriceHistory={p.localArea.averagePriceHistory}
          salesVolume={p.localArea.salesVolume}
        />

        <SellingAdviceCta />

        <ComparableSalesSection
          areaName={areaName}
          sales={p.localArea.comparableSales}
        />
      </div>

      <footer className="mt-6 pb-2 text-center text-xs text-ink-faint sm:mt-8">
        Illustrative market data · {areaName}
      </footer>
    </main>
  )
}
