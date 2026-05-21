export function toTotalMonths(years: number, months: number): number {
  return years * 12 + months
}

export function fromTotalMonths(total: number): {
  years: number
  months: number
} {
  return { years: Math.floor(total / 12), months: total % 12 }
}

export function formatTerm(years: number, months: number): string {
  if (years === 0) {
    return months === 1 ? '1 month' : `${months} months`
  }
  if (months === 0) {
    return years === 1 ? '1 year' : `${years} years`
  }
  const y = years === 1 ? '1 year' : `${years} years`
  const m = months === 1 ? '1 month' : `${months} months`
  return `${y} ${m}`
}

export function formatDurationMonths(totalMonths: number): string {
  const { years, months } = fromTotalMonths(totalMonths)
  if (years === 0) {
    return months === 1 ? '1 month' : `${months} months`
  }
  if (months === 0) {
    return years === 1 ? '1 year' : `${years} years`
  }
  const y = years === 1 ? '1 year' : `${years} years`
  const m = months === 1 ? '1 month' : `${months} months`
  return `${y} ${m}`
}

function monthlyRate(annualRatePercent: number): number {
  return annualRatePercent / 100 / 12
}

/** Standard amortising monthly repayment (repayment mortgage). */
export function monthlyPayment(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
): number {
  if (termMonths <= 0) return principal
  const r = monthlyRate(annualRatePercent)
  if (r === 0) return principal / termMonths
  const factor = Math.pow(1 + r, termMonths)
  return (principal * r * factor) / (factor - 1)
}

/** Months to clear balance at a fixed monthly payment and rate. */
export function termMonthsFromPayment(
  principal: number,
  annualRatePercent: number,
  payment: number,
): number {
  const r = monthlyRate(annualRatePercent)
  if (r === 0) return Math.ceil(principal / payment)
  const denom = payment - principal * r
  if (denom <= 0) return toTotalMonths(99, 0)
  const ratio = payment / denom
  return Math.ceil(Math.log(ratio) / Math.log(1 + r))
}

export function monthsSaved(
  currentTermMonths: number,
  newTermMonths: number,
): number {
  return Math.max(0, currentTermMonths - newTermMonths)
}
