import { describe, expect, it } from "vitest";
import { calculateLumpsumFutureValue } from "./lumpsum";

describe("calculateLumpsumFutureValue", () => {
  it("compounds annually at the given rate", () => {
    expect(calculateLumpsumFutureValue(100000, 12, 5)).toBeCloseTo(
      176234.17,
      2
    );
  });

  it("returns the principal unchanged over zero years", () => {
    expect(calculateLumpsumFutureValue(50000, 12, 0)).toBe(50000);
  });
});
