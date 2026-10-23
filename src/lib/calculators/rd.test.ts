import { describe, expect, it } from "vitest";
import { calculateRdMaturityValue } from "./rd";

describe("calculateRdMaturityValue", () => {
  it("matches the annuity-due RD formula", () => {
    expect(calculateRdMaturityValue(5000, 6.5, 24)).toBeCloseTo(128472.7, 1);
  });
});
