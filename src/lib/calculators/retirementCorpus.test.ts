import { describe, expect, it } from "vitest";
import { calculateRetirementCorpus } from "./retirementCorpus";

describe("calculateRetirementCorpus", () => {
  it("computes required vs projected corpus and the gap", () => {
    const result = calculateRetirementCorpus({
      currentAge: 30,
      retirementAge: 60,
      monthlyExpensesToday: 50000,
      inflationRatePercent: 6,
      postRetirementYears: 20,
      currentRetirementSavings: 500000,
      monthlyRetirementContribution: 10000,
      preRetirementReturnPercent: 10,
    });

    expect(result.requiredCorpus).toBeCloseTo(68921894.07, 1);
    expect(result.projectedCorpus).toBeCloseTo(31517954.38, 1);
    expect(result.gap).toBeCloseTo(37403939.7, 1);
  });

  it("has no gap once projected corpus already meets the requirement", () => {
    const result = calculateRetirementCorpus({
      currentAge: 55,
      retirementAge: 60,
      monthlyExpensesToday: 10000,
      inflationRatePercent: 6,
      postRetirementYears: 5,
      currentRetirementSavings: 50000000,
      monthlyRetirementContribution: 50000,
      preRetirementReturnPercent: 10,
    });

    expect(result.gap).toBe(0);
  });
});
