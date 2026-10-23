export interface YearlyBalance {
  year: number;
  balance: number;
}

export interface PpfResult {
  maturityValue: number;
  yearlyBreakdown: Array<YearlyBalance>;
}

// PPF contributions are typically made early in the financial year (annuity
// due), with interest compounded annually.
export function calculatePpfMaturity(
  yearlyContribution: number,
  ratePercent: number,
  tenureYears: number
): PpfResult {
  const rate = ratePercent / 100;
  let balance = 0;
  const yearlyBreakdown: Array<YearlyBalance> = [];

  for (let year = 1; year <= tenureYears; year++) {
    balance = (balance + yearlyContribution) * (1 + rate);
    yearlyBreakdown.push({ year, balance });
  }

  return { maturityValue: balance, yearlyBreakdown };
}
