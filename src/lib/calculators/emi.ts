/**
 * Calculates the EMI (Equated Monthly Installment) for a loan
 * @param principal The loan amount
 * @param ratePerAnnum Annual interest rate (in percentage)
 * @param tenureMonths Loan tenure in months
 * @returns Monthly EMI amount
 */
export function calculateEMI(
  principal: number,
  ratePerAnnum: number,
  tenureMonths: number
): number {
  const monthlyRate = ratePerAnnum / 12 / 100;

  if (monthlyRate === 0) return principal / tenureMonths;

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );
}

/**
 * Calculates the present value (PV) of a future sum
 * @param futureValue Future value amount
 * @param ratePerAnnum Annual interest rate (in percentage)
 * @param tenureMonths Time period in months
 * @returns Present value of the future sum
 */
export function calculatePresentValue(
  futureValue: number,
  ratePerAnnum: number,
  tenureMonths: number
): number {
  const monthlyRate = ratePerAnnum / 12 / 100;
  return futureValue / Math.pow(1 + monthlyRate, tenureMonths);
}

export function calculateTotalInterest(
  principal: number,
  ratePerAnnum: number,
  tenureMonths: number
): number {
  const emi = calculateEMI(principal, ratePerAnnum, tenureMonths);
  return emi * tenureMonths - principal;
}

// Months needed to clear `principal` at `monthlyPayment`, at `ratePerAnnum`.
// Returns null if the payment doesn't even cover the interest accruing each
// month, so the debt would never be paid off.
export function calculateMonthsToPayOff(
  principal: number,
  ratePerAnnum: number,
  monthlyPayment: number
): number | null {
  const monthlyRate = ratePerAnnum / 12 / 100;
  if (monthlyRate === 0) return principal / monthlyPayment;

  const monthlyInterest = principal * monthlyRate;
  if (monthlyPayment <= monthlyInterest) return null;

  return (
    Math.log(monthlyPayment / (monthlyPayment - monthlyInterest)) /
    Math.log(1 + monthlyRate)
  );
}
