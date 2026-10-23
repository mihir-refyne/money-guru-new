import { describe, expect, it } from "vitest";
import { calculateIncomeTax, calculateTaxableIncome } from "./tax";

const config = {
  regimeLabel: "test",
  standardDeduction: 75000,
  cessRatePercent: 4,
  rebateMaxTaxableIncome: 700000,
  slabs: [
    { upTo: 300000, ratePercent: 0 },
    { upTo: 700000, ratePercent: 5 },
    { upTo: 1000000, ratePercent: 10 },
    { upTo: 1200000, ratePercent: 15 },
    { upTo: 1500000, ratePercent: 20 },
    { upTo: null, ratePercent: 30 },
  ],
};

describe("calculateTaxableIncome", () => {
  it("subtracts the standard deduction", () => {
    expect(calculateTaxableIncome(1000000, config)).toBe(925000);
  });

  it("never goes negative", () => {
    expect(calculateTaxableIncome(50000, config)).toBe(0);
  });
});

describe("calculateIncomeTax", () => {
  it("is zero for non-positive income", () => {
    expect(calculateIncomeTax(0, config)).toBe(0);
    expect(calculateIncomeTax(-100, config)).toBe(0);
  });

  it("applies the Section 87A rebate up to the threshold", () => {
    expect(calculateIncomeTax(700000, config)).toBe(0);
    expect(calculateIncomeTax(300000, config)).toBe(0);
  });

  it("taxes only the amount above the rebate threshold, plus cess", () => {
    // 800000 taxable: 0 for first 300000, 5% of 400000 (300000-700000) = 20000,
    // 10% of 100000 (700000-800000) = 10000 -> 30000, + 4% cess = 31200
    expect(calculateIncomeTax(800000, config)).toBeCloseTo(31200, 5);
  });

  it("applies every slab correctly for a high income", () => {
    // 2000000 taxable:
    // 0-300000 @ 0% = 0
    // 300000-700000 @ 5% = 20000
    // 700000-1000000 @ 10% = 30000
    // 1000000-1200000 @ 15% = 30000
    // 1200000-1500000 @ 20% = 60000
    // 1500000-2000000 @ 30% = 150000
    // total = 290000, + 4% cess = 301600
    expect(calculateIncomeTax(2000000, config)).toBeCloseTo(301600, 5);
  });
});
