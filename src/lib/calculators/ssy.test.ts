import { describe, expect, it } from "vitest";
import { calculateSsyMaturity } from "./ssy";

describe("calculateSsyMaturity", () => {
  it("compounds deposits for depositYears then grows with no new deposits until maturityYears", () => {
    const result = calculateSsyMaturity(150000, 8.2, 15, 21);
    expect(result.maturityValue).toBeCloseTo(7182119.17, 1);
  });
});
