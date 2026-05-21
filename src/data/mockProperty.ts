export type AlertSeverity = 'info' | 'warning' | 'critical'

export type EpcRating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

export interface Alert {
  id: string
  severity: AlertSeverity
  title: string
  message: string
  date: string
}

export interface ComparableSale {
  id: string
  imageUrl: string
  line1: string
  line2: string
  postcode: string
  soldPrice: number
  /** ISO 8601 date (YYYY-MM-DD) — date of legal completion */
  completionDate: string
}

export interface PropertyMortgage {
  address: {
    line1: string
    line2: string
    city: string
    postcode: string
  }
  coordinates: { lat: number; lng: number }
  propertyDetails: {
    livingAreaSqm: number
    bedrooms: number
    bathrooms: number
    epcRating: EpcRating
    epcAssessmentDate: string
  }
  propertyValue: number
  valueHistory: { label: string; value: number }[]
  valueChangeQuarter: {
    amount: number
    percent: number
  }
  mortgageBalance: number
  mortgageRate: number
  mortgageType: string
  dealRemainingMonths: number
  termRemainingYears: number
  termRemainingMonths: number
  offer: {
    rate: number
    type: string
    termRemainingYears: number
    termRemainingMonths: number
  }
  equity: number
  ltv: number
  localArea: {
    averagePriceHistory: { label: string; value: number }[]
    salesVolume: { label: string; value: number }[]
    comparableSales: ComparableSale[]
  }
  alerts: Alert[]
}

export const mockProperty: PropertyMortgage = {
  address: {
    line1: '14 Lansdowne Terrace',
    line2: 'Camden',
    city: 'London',
    postcode: 'NW1 9RG',
  },
  coordinates: { lat: 51.5342, lng: -0.1458 },
  propertyDetails: {
    livingAreaSqm: 118,
    bedrooms: 3,
    bathrooms: 2,
    epcRating: 'C',
    epcAssessmentDate: '14 March 2019',
  },
  propertyValue: 685_000,
  valueHistory: [
    { label: "Q2 '23", value: 565_000 },
    { label: "Q3 '23", value: 578_000 },
    { label: "Q4 '23", value: 571_000 },
    { label: "Q1 '24", value: 584_000 },
    { label: "Q2 '24", value: 577_000 },
    { label: "Q3 '24", value: 591_000 },
    { label: "Q4 '24", value: 586_000 },
    { label: "Q1 '25", value: 601_000 },
    { label: "Q2 '25", value: 594_000 },
    { label: "Q3 '25", value: 610_000 },
    { label: "Q4 '25", value: 603_000 },
    { label: "Q1 '26", value: 672_500 },
    { label: "Q2 '26", value: 685_000 },
  ],
  valueChangeQuarter: {
    amount: 12_500,
    percent: 1.86,
  },
  mortgageBalance: 412_350,
  mortgageRate: 4.89,
  mortgageType: 'Fixed rate',
  dealRemainingMonths: 4,
  termRemainingYears: 18,
  termRemainingMonths: 4,
  offer: {
    rate: 3.94,
    type: '5-year fixed',
    termRemainingYears: 18,
    termRemainingMonths: 4,
  },
  equity: 272_650,
  ltv: 60.2,
  localArea: {
    averagePriceHistory: [
      { label: "Q2 '23", value: 518_000 },
      { label: "Q3 '23", value: 528_000 },
      { label: "Q4 '23", value: 522_000 },
      { label: "Q1 '24", value: 535_000 },
      { label: "Q2 '24", value: 529_000 },
      { label: "Q3 '24", value: 542_000 },
      { label: "Q4 '24", value: 536_000 },
      { label: "Q1 '25", value: 551_000 },
      { label: "Q2 '25", value: 544_000 },
      { label: "Q3 '25", value: 558_000 },
      { label: "Q4 '25", value: 552_000 },
      { label: "Q1 '26", value: 612_000 },
      { label: "Q2 '26", value: 622_000 },
    ],
    salesVolume: [
      { label: "Q2 '23", value: 42 },
      { label: "Q3 '23", value: 56 },
      { label: "Q4 '23", value: 36 },
      { label: "Q1 '24", value: 49 },
      { label: "Q2 '24", value: 34 },
      { label: "Q3 '24", value: 53 },
      { label: "Q4 '24", value: 41 },
      { label: "Q1 '25", value: 58 },
      { label: "Q2 '25", value: 39 },
      { label: "Q3 '25", value: 63 },
      { label: "Q4 '25", value: 47 },
      { label: "Q1 '26", value: 54 },
      { label: "Q2 '26", value: 66 },
    ],
    comparableSales: [
      {
        id: 'comp-1',
        imageUrl:
          'https://images.unsplash.com/photo-1677491953478-06a0adb1c6bc?w=640&h=480&fit=crop',
        line1: '22 Gloucester Avenue',
        line2: 'Camden',
        postcode: 'NW1 7LD',
        soldPrice: 695_000,
        completionDate: '2026-04-28',
      },
      {
        id: 'comp-2',
        imageUrl:
          'https://images.unsplash.com/photo-1698431194884-295617261396?w=640&h=480&fit=crop',
        line1: '8 Chalcot Crescent',
        line2: 'Primrose Hill',
        postcode: 'NW1 8TY',
        soldPrice: 672_500,
        completionDate: '2026-03-14',
      },
      {
        id: 'comp-3',
        imageUrl:
          'https://images.unsplash.com/photo-1700419595003-cf7449b63408?w=640&h=480&fit=crop',
        line1: '31 Prince Albert Road',
        line2: 'Camden',
        postcode: 'NW1 7TL',
        soldPrice: 710_000,
        completionDate: '2026-02-06',
      },
      {
        id: 'comp-4',
        imageUrl:
          'https://images.unsplash.com/photo-1722062767419-ff110d4e7db7?w=640&h=480&fit=crop',
        line1: '5 Eglon Mews',
        line2: 'Camden',
        postcode: 'NW1 7BN',
        soldPrice: 658_000,
        completionDate: '2025-12-19',
      },
    ],
  },
  alerts: [
    {
      id: '1',
      severity: 'warning',
      title: 'Fixed-rate period ends in 4 months',
      message:
        'Your current deal expires on 15 January 2027. Review remortgage options to avoid reverting to the standard variable rate (SVR).',
      date: '21 May 2026',
    },
    {
      id: '2',
      severity: 'info',
      title: 'Estimated property value updated',
      message:
        'Estimated value increased by £12,500 (+1.9%) since last quarter, based on local market comparables.',
      date: '18 May 2026',
    },
    {
      id: '3',
      severity: 'info',
      title: 'Loan-to-value (LTV) below 65%',
      message:
        'You may qualify for better mortgage products when you remortgage. Equity of £272,650 gives you room to negotiate.',
      date: '12 May 2026',
    },
  ],
}
