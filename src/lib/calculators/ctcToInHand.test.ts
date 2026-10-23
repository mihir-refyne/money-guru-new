import { describe, expect, it } from "vitest";
import { calculateCtcToInHand } from "./ctcToInHand";

// Uses the real data/calculators_config.json defaults (basic = 40% of CTC,
// PF at 12%/12% capped at 15000, professional tax 200/month, new-regime
// slabs with a 700000 rebate threshold) so this also guards against
// accidental config drift.
describe("calculateCtcToInHand", () => {
  it("computes basic, PF, tax and in-hand salary for a 12L CTC", () => {
    const result = calculateCtcToInHand({ annualCtc: 1200000 });

    expect(result.monthlyBasicSalary).toBe(40000);
    expect(result.monthlyEmployeePf).toBe(1800);
    expect(result.monthlyEmployerPf).toBe(1800);
    expect(result.monthlyProfessionalTax).toBe(200);
    expect(result.annualIncomeTax).toBeCloseTo(68130.4, 5);
    expect(result.monthlyIncomeTax).toBeCloseTo(5677.533333, 5);
    expect(result.monthlyInHandSalary).toBeCloseTo(90522.466667, 5);
    expect(result.annualInHandSalary).toBeCloseTo(1086269.6, 3);
  });

  it("pays zero income tax once the rebate threshold absorbs it", () => {
    const result = calculateCtcToInHand({ annualCtc: 500000 });

    expect(result.monthlyIncomeTax).toBe(0);
    expect(result.monthlyInHandSalary).toBeCloseTo(37866.666667, 5);
  });

  it("never returns a negative in-hand salary", () => {
    const result = calculateCtcToInHand({ annualCtc: 0 });
    expect(result.monthlyInHandSalary).toBe(0);
  });
});
