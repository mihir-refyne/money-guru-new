import { describe, expect, it } from "vitest";
import { calculateSwp } from "./swp";

describe("calculateSwp", () => {
  it("computes months until depleted and total withdrawn", () => {
    const result = calculateSwp(1000000, 8, 10000);
    expect(result.monthsUntilDepleted).toBeCloseTo(165.34, 1);
    expect(result.totalWithdrawn).toBeCloseTo(1653405.41, 1);
  });

  it("returns nulls when the withdrawal never exceeds the interest earned", () => {
    const result = calculateSwp(1000000, 12, 5000);
    expect(result.monthsUntilDepleted).toBeNull();
    expect(result.totalWithdrawn).toBeNull();
  });
});
