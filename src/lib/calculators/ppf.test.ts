import { describe, expect, it } from "vitest";
import { calculatePpfMaturity } from "./ppf";

describe("calculatePpfMaturity", () => {
  it("matches the annuity-due PPF formula over the full tenure", () => {
    const result = calculatePpfMaturity(150000, 7.1, 15);
    expect(result.maturityValue).toBeCloseTo(4068209.22, 1);
    expect(result.yearlyBreakdown).toHaveLength(15);
    expect(result.yearlyBreakdown[0].balance).toBeCloseTo(160650, 1);
    expect(result.yearlyBreakdown[14].balance).toBeCloseTo(
      result.maturityValue,
      5
    );
  });

  it("balances increase monotonically year over year", () => {
    const result = calculatePpfMaturity(50000, 7.1, 5);
    for (let i = 1; i < result.yearlyBreakdown.length; i++) {
      expect(result.yearlyBreakdown[i].balance).toBeGreaterThan(
        result.yearlyBreakdown[i - 1].balance
      );
    }
  });
});
