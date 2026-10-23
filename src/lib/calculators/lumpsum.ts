export function calculateLumpsumFutureValue(
  principal: number,
  annualRatePercent: number,
  years: number
): number {
  return principal * Math.pow(1 + annualRatePercent / 100, years);
}
