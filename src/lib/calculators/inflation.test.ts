import { describe, expect, it } from "vitest";
import { calculateFutureCost } from "./inflation";

describe("calculateFutureCost", () => {
  it("compounds the current cost at the inflation rate", () => {
    expect(calculateFutureCost(50000, 6, 10)).toBeCloseTo(89542.38, 2);
  });

  it("returns the current cost unchanged over zero years", () => {
    expect(calculateFutureCost(50000, 6, 0)).toBe(50000);
  });
});
