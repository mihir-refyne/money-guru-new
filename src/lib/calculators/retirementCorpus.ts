import { calculateFutureCost } from "./inflation";
import { calculateLumpsumFutureValue } from "./lumpsum";
import { calculateSipFutureValue } from "./sip";

export interface RetirementCorpusInput {
  currentAge: number;
  retirementAge: number;
  monthlyExpensesToday: number;
  inflationRatePercent: number;
  postRetirementYears: number;
  currentRetirementSavings: number;
  monthlyRetirementContribution: number;
  preRetirementReturnPercent: number;
}

export interface RetirementCorpusResult {
  requiredCorpus: number;
  projectedCorpus: number;
  gap: number;
}

// Simplified, guidance-level model: required corpus = inflated monthly
// expense at retirement x 12 x years in retirement (no further growth
// assumed during retirement itself, a deliberately conservative
// simplification). Projected corpus = today's retirement savings grown to
// retirement + monthly EPF/VPF/NPS-style contributions compounding to
// retirement.
export function calculateRetirementCorpus(
  input: RetirementCorpusInput
): RetirementCorpusResult {
  const {
    currentAge,
    retirementAge,
    monthlyExpensesToday,
    inflationRatePercent,
    postRetirementYears,
    currentRetirementSavings,
    monthlyRetirementContribution,
    preRetirementReturnPercent,
  } = input;

  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const monthlyExpenseAtRetirement = calculateFutureCost(
    monthlyExpensesToday,
    inflationRatePercent,
    yearsToRetirement
  );
  const requiredCorpus =
    monthlyExpenseAtRetirement * 12 * postRetirementYears;

  const projectedFromSavings = calculateLumpsumFutureValue(
    currentRetirementSavings,
    preRetirementReturnPercent,
    yearsToRetirement
  );
  const projectedFromContributions = calculateSipFutureValue(
    monthlyRetirementContribution,
    preRetirementReturnPercent,
    yearsToRetirement * 12
  );
  const projectedCorpus = projectedFromSavings + projectedFromContributions;

  return {
    requiredCorpus,
    projectedCorpus,
    gap: Math.max(0, requiredCorpus - projectedCorpus),
  };
}
