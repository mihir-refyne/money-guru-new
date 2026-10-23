export function calculateFutureCost(
  currentCost: number,
  inflationRatePercent: number,
  years: number
): number {
  return currentCost * Math.pow(1 + inflationRatePercent / 100, years);
}
