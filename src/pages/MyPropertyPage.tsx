import type { AppPage } from '../components/AppTabs'
import { MapPageShell } from '../components/MapPageShell'
import { PropertyAddressBar } from '../components/PropertyAddressBar'
import { PropertyDetailsSection } from '../components/PropertyDetailsSection'
import { mockProperty } from '../data/mockProperty'

interface MyPropertyPageProps {
  activePage: AppPage
  onNavigate: (page: AppPage) => void
}

export function MyPropertyPage({ activePage, onNavigate }: MyPropertyPageProps) {
  const p = mockProperty
  const d = p.propertyDetails

  return (
    <main className="mx-auto max-w-2xl px-4 py-5 min-[520px]:max-w-4xl sm:py-6 lg:max-w-5xl lg:px-8">
      <div className="flex flex-col gap-4 sm:gap-5">
        <MapPageShell activePage={activePage} onNavigate={onNavigate}>
          <PropertyAddressBar
            line1={p.address.line1}
            line2={p.address.line2}
            city={p.address.city}
            postcode={p.address.postcode}
            lat={p.coordinates.lat}
            lng={p.coordinates.lng}
          />
        </MapPageShell>

        <PropertyDetailsSection
          livingAreaSqm={d.livingAreaSqm}
          bedrooms={d.bedrooms}
          bathrooms={d.bathrooms}
          epcRating={d.epcRating}
          epcAssessmentDate={d.epcAssessmentDate}
        />
      </div>

      <footer className="mt-6 pb-2 text-center text-xs text-ink-faint sm:mt-8">
        Illustrative property data · EPC rating C
      </footer>
    </main>
  )
}
