import { PropertyMap } from './PropertyMap'

interface PropertyAddressBarProps {
  line1: string
  line2: string
  city: string
  postcode: string
  lat: number
  lng: number
}

export function PropertyAddressBar({
  line1,
  line2,
  city,
  postcode,
  lat,
  lng,
}: PropertyAddressBarProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
          Property address
        </p>
        <address className="mt-2 not-italic">
          <p className="text-base font-semibold leading-snug text-ink sm:text-lg">
            {line1}
          </p>
          <p className="text-sm text-ink-muted">
            {line2}, {city}
          </p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-ink">
            {postcode}
          </p>
        </address>
      </div>

      <div className="h-[148px] min-w-0 sm:h-[168px]">
        <PropertyMap lat={lat} lng={lng} postcode={postcode} fill />
      </div>
    </div>
  )
}
