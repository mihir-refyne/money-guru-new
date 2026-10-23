import { describe, expect, it } from "vitest";
import { compareFlatVsReducingRate } from "./flatVsReducing";
import { calculateEMI } from "./emi";

describe("compareFlatVsReducingRate", () => {
  it("computes the flat-rate EMI and the equivalent reducing rate", () => {
    const result = compareFlatVsReducingRate(100000, 12, 10);
    expect(result.emiUnderFlatRate).toBeCloseTo(9166.67, 2);
    expect(result.totalInterestUnderFlatRate).toBe(10000);
    expect(result.equivalentReducingRatePercent).toBeCloseTo(17.97, 1);
  });

  it("the equivalent reducing rate reproduces the same EMI", () => {
    const result = compareFlatVsReducingRate(100000, 12, 10);
    const emiAtEquivalentRate = calculateEMI(
      100000,
      result.equivalentReducingRatePercent,
      12
    );
    expect(emiAtEquivalentRate).toBeCloseTo(result.emiUnderFlatRate, 1);
  });

  it("the equivalent reducing rate is always higher than the flat rate", () => {
    const result = compareFlatVsReducingRate(200000, 24, 8);
    expect(result.equivalentReducingRatePercent).toBeGreaterThan(8);
  });
});
