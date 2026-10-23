import { describe, expect, it } from "vitest";
import { calculateGratuity } from "./gratuity";

describe("calculateGratuity", () => {
  it("applies the Payment of Gratuity Act formula when eligible", () => {
    const result = calculateGratuity(50000, 10, 5, 15, 26);
    expect(result.isEligible).toBe(true);
    expect(result.gratuityAmount).toBeCloseTo(288461.54, 1);
  });

  it("is zero and ineligible under the minimum years of service", () => {
    const result = calculateGratuity(50000, 3, 5, 15, 26);
    expect(result.isEligible).toBe(false);
    expect(result.gratuityAmount).toBe(0);
  });
});
