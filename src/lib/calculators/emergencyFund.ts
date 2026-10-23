export interface EmergencyFundResult {
  targetAmount: number;
  gap: number;
}

export function calculateEmergencyFundGap(
  monthlyExpenses: number,
  monthsOfCoverage: number,
  currentSavings: number
): EmergencyFundResult {
  const targetAmount = monthlyExpenses * monthsOfCoverage;
  return {
    targetAmount,
    gap: Math.max(0, targetAmount - currentSavings),
  };
}
