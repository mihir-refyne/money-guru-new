import { describe, expect, it } from "vitest";
import { calculateLoanPrepaymentImpact } from "./loanPrepayment";

describe("calculateLoanPrepaymentImpact", () => {
  it("reduces tenure and saves interest when the EMI stays the same", () => {
    const result = calculateLoanPrepaymentImpact({
      outstandingPrincipal: 500000,
      annualRatePercent: 10,
      remainingTenureMonths: 60,
      prepaymentAmount: 100000,
    });

    expect(result.tenureReducedMonths).toBeGreaterThan(0);
    expect(result.newRemainingTenureMonths).toBeLessThan(60);
    expect(result.interestSaved).toBeGreaterThan(0);
    expect(result.newRemainingInterest).toBeLessThan(
      result.originalRemainingInterest
    );
  });

  it("clears the loan immediately when the prepayment covers the full principal", () => {
    const result = calculateLoanPrepaymentImpact({
      outstandingPrincipal: 50000,
      annualRatePercent: 10,
      remainingTenureMonths: 12,
      prepaymentAmount: 60000,
    });

    expect(result.newRemainingTenureMonths).toBe(0);
    expect(result.newRemainingInterest).toBe(0);
    expect(result.tenureReducedMonths).toBe(12);
    expect(result.interestSaved).toBeCloseTo(result.originalRemainingInterest, 5);
  });

  it("does nothing when there is no prepayment", () => {
    const result = calculateLoanPrepaymentImpact({
      outstandingPrincipal: 500000,
      annualRatePercent: 10,
      remainingTenureMonths: 60,
      prepaymentAmount: 0,
    });

    expect(result.newRemainingTenureMonths).toBeCloseTo(60, 1);
    expect(result.interestSaved).toBeCloseTo(0, 1);
  });
});
