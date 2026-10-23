import { calculateMonthsToPayOff } from "./emi";

export interface PayoffInput {
  outstandingBalance: number;
  annualRatePercent: number;
  monthlyPayment: number;
}

export interface PayoffResult {
  monthsToPayOff: number | null;
  totalInterest: number | null;
}

// `monthsToPayOff` is null when `monthlyPayment` doesn't even cover the
// interest accruing each month, so the balance would never clear.
export function calculatePayoff(input: PayoffInput): PayoffResult {
  const { outstandingBalance, annualRatePercent, monthlyPayment } = input;
  const monthsToPayOff = calculateMonthsToPayOff(
    outstandingBalance,
    annualRatePercent,
    monthlyPayment
  );
  if (monthsToPayOff === null) {
    return { monthsToPayOff: null, totalInterest: null };
  }
  return {
    monthsToPayOff,
    totalInterest: monthlyPayment * monthsToPayOff - outstandingBalance,
  };
}
