import type { AppPage } from '../components/AppTabs'
import { AlertsPanel } from '../components/AlertsPanel'
import { MapPageShell } from '../components/MapPageShell'
import { MortgageSection } from '../components/MortgageSection'
import { PropertyAddressBar } from '../components/PropertyAddressBar'
import { EquitySection } from '../components/EquitySection'
import { PropertyValueSection } from '../components/PropertyValueSection'
import { mockProperty } from '../data/mockProperty'

interface OverviewPageProps {
  activePage: AppPage
  onNavigate: (page: AppPage) => void
}

export function OverviewPage({ activePage, onNavigate }: OverviewPageProps) {
  const p = mockProperty

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

        <PropertyValueSection
          value={p.propertyValue}
          valueChangeQuarter={p.valueChangeQuarter}
          valueHistory={p.valueHistory}
          onNavigate={onNavigate}
        />

        <EquitySection equity={p.equity} />

        <MortgageSection
          balance={p.mortgageBalance}
          currentRate={p.mortgageRate}
          currentType={p.mortgageType}
          dealRemainingMonths={p.dealRemainingMonths}
          currentTermYears={p.termRemainingYears}
          currentTermMonths={p.termRemainingMonths}
          offerRate={p.offer.rate}
          offerType={p.offer.type}
          offerTermYears={p.offer.termRemainingYears}
          offerTermMonths={p.offer.termRemainingMonths}
          ltv={p.ltv}
        />

        <AlertsPanel alerts={p.alerts} />
      </div>

      <footer className="mt-6 pb-2 text-center text-xs text-ink-faint sm:mt-8">
        Illustrative data only
      </footer>
    </main>
  )
}
