export interface SsyResult {
  maturityValue: number;
}

// Sukanya Samriddhi Yojana: deposits are made for `depositYears` (typically
// 15), then the balance simply keeps compounding (no further deposits)
// until `maturityYears` (typically 21) from account opening.
export function calculateSsyMaturity(
  yearlyDeposit: number,
  ratePercent: number,
  depositYears: number,
  maturityYears: number
): SsyResult {
  const rate = ratePercent / 100;
  let balance = 0;

  for (let year = 1; year <= maturityYears; year++) {
    if (year <= depositYears) {
      balance = (balance + yearlyDeposit) * (1 + rate);
    } else {
      balance = balance * (1 + rate);
    }
  }

  return { maturityValue: balance };
}
