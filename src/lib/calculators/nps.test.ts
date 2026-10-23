import { describe, expect, it } from "vitest";
import { calculateNpsProjection } from "./nps";

describe("calculateNpsProjection", () => {
  it("projects corpus, annuitized split, and estimated pension", () => {
    const result = calculateNpsProjection({
      monthlyContribution: 5000,
      currentAge: 30,
      annualRatePercent: 10,
      minAnnuityPercent: 40,
      assumedAnnuityRatePercent: 6,
      retirementAge: 60,
    });

    expect(result.projectedCorpus).toBeCloseTo(11396626.62, 1);
    expect(result.annuitizedAmount).toBeCloseTo(4558650.65, 1);
    expect(result.lumpSumWithdrawal).toBeCloseTo(6837975.97, 1);
    expect(result.estimatedMonthlyPension).toBeCloseTo(22793.25, 1);
  });
});
