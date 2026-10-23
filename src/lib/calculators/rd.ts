import { calculateSipFutureValue } from "./sip";

// A recurring deposit is the same annuity-due math as a SIP — fixed monthly
// deposit, fixed rate, compounded monthly.
export function calculateRdMaturityValue(
  monthlyDeposit: number,
  annualRatePercent: number,
  tenureMonths: number
): number {
  return calculateSipFutureValue(
    monthlyDeposit,
    annualRatePercent,
    tenureMonths
  );
}
