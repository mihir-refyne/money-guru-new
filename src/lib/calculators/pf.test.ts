import { describe, expect, it } from "vitest";
import {
  calculateMonthlyEmployeePfContribution,
  calculateMonthlyEmployerPfContribution,
} from "./pf";

const config = {
  employeeContributionRatePercent: 12,
  employerContributionRatePercent: 12,
  monthlyWageCeiling: 15000,
};

describe("calculateMonthlyEmployeePfContribution", () => {
  it("is 12% of basic when basic is below the wage ceiling", () => {
    expect(calculateMonthlyEmployeePfContribution(10000, config)).toBe(1200);
  });

  it("caps at the statutory wage ceiling when basic exceeds it", () => {
    expect(calculateMonthlyEmployeePfContribution(50000, config)).toBe(1800);
  });
});

describe("calculateMonthlyEmployerPfContribution", () => {
  it("mirrors the employee contribution at the configured rate", () => {
    expect(calculateMonthlyEmployerPfContribution(10000, config)).toBe(1200);
    expect(calculateMonthlyEmployerPfContribution(50000, config)).toBe(1800);
  });
});
