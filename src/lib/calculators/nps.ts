import { calculateSipFutureValue } from "./sip";

export interface NpsInput {
  monthlyContribution: number;
  currentAge: number;
  annualRatePercent: number;
  minAnnuityPercent: number;
  assumedAnnuityRatePercent: number;
  retirementAge: number;
}

export interface NpsResult {
  projectedCorpus: number;
  lumpSumWithdrawal: number;
  annuitizedAmount: number;
  estimatedMonthlyPension: number;
}

// Projects the NPS corpus as a plain SIP (monthly contribution compounding
// to retirement), then splits it per the regulatory minimum annuitization
// (currently 40%) and estimates a pension off the annuitized portion at an
// assumed annuity rate — actual rates vary by provider and are set at
// retirement, so this is a rough guide only.
export function calculateNpsProjection(input: NpsInput): NpsResult {
  const {
    monthlyContribution,
    currentAge,
    annualRatePercent,
    minAnnuityPercent,
    assumedAnnuityRatePercent,
    retirementAge,
  } = input;

  const tenureMonths = Math.max(0, (retirementAge - currentAge) * 12);
  const projectedCorpus = calculateSipFutureValue(
    monthlyContribution,
    annualRatePercent,
    tenureMonths
  );

  const annuitizedAmount = (projectedCorpus * minAnnuityPercent) / 100;
  const lumpSumWithdrawal = projectedCorpus - annuitizedAmount;
  const estimatedMonthlyPension =
    (annuitizedAmount * (assumedAnnuityRatePercent / 100)) / 12;

  return {
    projectedCorpus,
    lumpSumWithdrawal,
    annuitizedAmount,
    estimatedMonthlyPension,
  };
}
