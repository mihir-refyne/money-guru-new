import { describe, expect, it } from "vitest";
import { calculateEmergencyFundGap } from "./emergencyFund";

describe("calculateEmergencyFundGap", () => {
  it("computes the target and the remaining gap", () => {
    const result = calculateEmergencyFundGap(30000, 6, 50000);
    expect(result.targetAmount).toBe(180000);
    expect(result.gap).toBe(130000);
  });

  it("has no gap once savings cover the target", () => {
    const result = calculateEmergencyFundGap(30000, 6, 500000);
    expect(result.gap).toBe(0);
  });
});
