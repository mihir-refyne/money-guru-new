// SIP future value, annuity-due convention (each month's investment compounds
// for the remainder of the tenure, including the month it's invested in) —
// the convention used by every mainstream SIP calculator.
export function calculateSipFutureValue(
  monthlyInvestment: number,
  annualRatePercent: number,
  tenureMonths: number
): number {
  const monthlyRate = annualRatePercent / 12 / 100;
  if (monthlyRate === 0) return monthlyInvestment * tenureMonths;
  return (
    monthlyInvestment *
    ((Math.pow(1 + monthlyRate, tenureMonths) - 1) / monthlyRate) *
    (1 + monthlyRate)
  );
}

// Inverse of the above: the monthly SIP needed to reach `targetAmount`.
export function calculateRequiredMonthlySip(
  targetAmount: number,
  annualRatePercent: number,
  tenureMonths: number
): number {
  const monthlyRate = annualRatePercent / 12 / 100;
  if (monthlyRate === 0) return targetAmount / tenureMonths;
  return (
    targetAmount /
    (((Math.pow(1 + monthlyRate, tenureMonths) - 1) / monthlyRate) *
      (1 + monthlyRate))
  );
}

// SIP where the monthly investment increases by `annualStepUpPercent` every
// 12 months. No closed form once step-up is involved, so this walks month
// by month.
export function calculateStepUpSipFutureValue(
  initialMonthlyInvestment: number,
  annualRatePercent: number,
  annualStepUpPercent: number,
  tenureMonths: number
): number {
  const monthlyRate = annualRatePercent / 12 / 100;
  let futureValue = 0;
  for (let month = 0; month < tenureMonths; month++) {
    const currentYear = Math.floor(month / 12);
    const monthlyInvestment =
      initialMonthlyInvestment *
      Math.pow(1 + annualStepUpPercent / 100, currentYear);
    const remainingMonths = tenureMonths - month;
    futureValue +=
      monthlyInvestment * Math.pow(1 + monthlyRate, remainingMonths);
  }
  return futureValue;
}
