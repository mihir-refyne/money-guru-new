import { calculateMonthsToPayOff } from "./emi";

export interface SwpResult {
  // null means the corpus earns more each month than is withdrawn, so it
  // never depletes.
  monthsUntilDepleted: number | null;
  totalWithdrawn: number | null;
}

// A corpus earning interest while a fixed amount is withdrawn every month is
// mathematically identical to a loan being paid off at that same fixed
// payment — so this reuses the EMI payoff-months formula.
export function calculateSwp(
  corpus: number,
  annualRatePercent: number,
  monthlyWithdrawal: number
): SwpResult {
  const monthsUntilDepleted = calculateMonthsToPayOff(
    corpus,
    annualRatePercent,
    monthlyWithdrawal
  );
  if (monthsUntilDepleted === null) {
    return { monthsUntilDepleted: null, totalWithdrawn: null };
  }
  return {
    monthsUntilDepleted,
    totalWithdrawn: monthlyWithdrawal * monthsUntilDepleted,
  };
}
