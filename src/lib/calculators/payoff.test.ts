import { describe, expect, it } from "vitest";
import { calculatePayoff } from "./payoff";

describe("calculatePayoff", () => {
  it("computes months and total interest for a payment above the interest floor", () => {
    const result = calculatePayoff({
      outstandingBalance: 50000,
      annualRatePercent: 36,
      monthlyPayment: 3000,
    });

    expect(result.monthsToPayOff).not.toBeNull();
    expect(result.totalInterest).not.toBeNull();
    expect(result.totalInterest as number).toBeGreaterThan(0);
  });

  it("returns nulls when the payment never covers the interest", () => {
    const result = calculatePayoff({
      outstandingBalance: 50000,
      annualRatePercent: 36,
      monthlyPayment: 1000,
    });

    expect(result.monthsToPayOff).toBeNull();
    expect(result.totalInterest).toBeNull();
  });
});
