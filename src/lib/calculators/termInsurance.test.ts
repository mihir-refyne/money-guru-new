import { describe, expect, it } from "vitest";
import { calculateSuggestedTermCover } from "./termInsurance";

describe("calculateSuggestedTermCover", () => {
  it("scales the multiplier by the number of dependents", () => {
    const cover = calculateSuggestedTermCover(
      {
        annualIncome: 1200000,
        numberOfDependents: 2,
        outstandingLiabilities: 2000000,
        existingSavingsAndCover: 500000,
      },
      10,
      2
    );
    expect(cover).toBe(18300000);
  });

  it("never returns a negative suggested cover", () => {
    const cover = calculateSuggestedTermCover(
      {
        annualIncome: 500000,
        numberOfDependents: 0,
        outstandingLiabilities: 0,
        existingSavingsAndCover: 100000000,
      },
      10,
      2
    );
    expect(cover).toBe(0);
  });
});
