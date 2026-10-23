import { describe, expect, it } from "vitest";
import {
  calculateEMI,
  calculateMonthsToPayOff,
  calculatePresentValue,
  calculateTotalInterest,
} from "./emi";

describe("calculateEMI", () => {
  it("matches the standard EMI formula for a known case", () => {
    // 100000 at 12% p.a. for 12 months -> ~8884.88
    expect(calculateEMI(100000, 12, 12)).toBeCloseTo(8884.88, 2);
  });

  it("is a simple division when the rate is zero", () => {
    expect(calculateEMI(120000, 0, 12)).toBe(10000);
  });
});

describe("calculatePresentValue", () => {
  it("discounts a future value back by the given rate and tenure", () => {
    // 112000 one year out at 12% p.a. (12 monthly compounding) ~= 100000
    expect(calculatePresentValue(112682.5, 12, 12)).toBeCloseTo(100000, 0);
  });
});

describe("calculateTotalInterest", () => {
  it("is EMI * tenure minus principal", () => {
    const principal = 100000;
    const total = calculateTotalInterest(principal, 12, 12);
    expect(total).toBeCloseTo(8884.88 * 12 - principal, 1);
  });
});

describe("calculateMonthsToPayOff", () => {
  it("returns null when the payment doesn't cover monthly interest", () => {
    // 100000 at 24% p.a. -> monthly interest = 2000; payment of 1500 never clears it
    expect(calculateMonthsToPayOff(100000, 24, 1500)).toBeNull();
  });

  it("computes months to clear when the payment covers more than interest", () => {
    const months = calculateMonthsToPayOff(100000, 24, 5000);
    expect(months).not.toBeNull();
    expect(months as number).toBeCloseTo(25.79585, 3);
  });
});
