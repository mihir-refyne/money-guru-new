import { calculateEMI } from "./emi";

export interface FlatVsReducingResult {
  emiUnderFlatRate: number;
  totalInterestUnderFlatRate: number;
  equivalentReducingRatePercent: number;
}

// Lenders sometimes quote a "flat rate" instead of the reducing-balance rate
// used everywhere else in this app. Flat-rate interest is charged on the
// full principal for the whole tenure, so a loan advertised at the same
// headline % actually costs more than a reducing-rate loan. This finds the
// reducing rate that would produce the same EMI, via binary search since
// EMI increases monotonically with rate and there's no closed form.
export function compareFlatVsReducingRate(
  principal: number,
  tenureMonths: number,
  flatRatePercent: number
): FlatVsReducingResult {
  const tenureYears = tenureMonths / 12;
  const totalInterestUnderFlatRate =
    principal * (flatRatePercent / 100) * tenureYears;
  const emiUnderFlatRate =
    (principal + totalInterestUnderFlatRate) / tenureMonths;

  let low = 0;
  let high = 100;
  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const emiAtMid = calculateEMI(principal, mid, tenureMonths);
    if (emiAtMid > emiUnderFlatRate) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return {
    emiUnderFlatRate,
    totalInterestUnderFlatRate,
    equivalentReducingRatePercent: (low + high) / 2,
  };
}
