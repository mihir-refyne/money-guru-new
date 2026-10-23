import { describe, expect, it } from "vitest";
import {
  calculateRequiredMonthlySip,
  calculateSipFutureValue,
  calculateStepUpSipFutureValue,
} from "./sip";

describe("calculateSipFutureValue", () => {
  it("matches the standard annuity-due SIP formula", () => {
    expect(calculateSipFutureValue(10000, 12, 12)).toBeCloseTo(128093.28, 2);
  });

  it("is a simple sum when the rate is zero", () => {
    expect(calculateSipFutureValue(1000, 0, 10)).toBe(10000);
  });
});

describe("calculateRequiredMonthlySip", () => {
  it("is the inverse of calculateSipFutureValue", () => {
    const required = calculateRequiredMonthlySip(1000000, 12, 60);
    expect(required).toBeCloseTo(12123.22, 2);
    expect(calculateSipFutureValue(required, 12, 60)).toBeCloseTo(1000000, 1);
  });
});

describe("calculateStepUpSipFutureValue", () => {
  it("grows the monthly investment every 12 months", () => {
    expect(
      calculateStepUpSipFutureValue(10000, 12, 10, 24)
    ).toBeCloseTo(285241.32, 2);
  });

  it("matches plain SIP when the step-up is zero", () => {
    expect(calculateStepUpSipFutureValue(10000, 12, 0, 12)).toBeCloseTo(
      calculateSipFutureValue(10000, 12, 12),
      5
    );
  });
});
