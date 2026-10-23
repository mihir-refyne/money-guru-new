import { describe, expect, it } from "vitest";
import { calculateHraExemption } from "./hra";

const config = {
  metroExemptionPercentOfBasic: 50,
  nonMetroExemptionPercentOfBasic: 40,
  rentThresholdPercentOfBasic: 10,
};

describe("calculateHraExemption", () => {
  it("picks the lowest of the three limits (rent-minus-threshold wins)", () => {
    // basic 30000, HRA 15000, rent 12000, metro
    // actual HRA = 15000; rent - 10% of basic = 12000 - 3000 = 9000; 50% of basic = 15000
    // least = 9000
    const result = calculateHraExemption(
      {
        monthlyBasicSalary: 30000,
        monthlyHraReceived: 15000,
        monthlyRentPaid: 12000,
        isMetroCity: true,
      },
      config
    );
    expect(result.monthlyExemptAmount).toBe(9000);
    expect(result.monthlyTaxableHra).toBe(6000);
  });

  it("picks 40% of basic for non-metro when it's the smallest", () => {
    // basic 50000, HRA 25000, rent 30000, non-metro
    // actual HRA = 25000; rent - 10% of basic = 30000 - 5000 = 25000; 40% of basic = 20000
    // least = 20000
    const result = calculateHraExemption(
      {
        monthlyBasicSalary: 50000,
        monthlyHraReceived: 25000,
        monthlyRentPaid: 30000,
        isMetroCity: false,
      },
      config
    );
    expect(result.monthlyExemptAmount).toBe(20000);
    expect(result.monthlyTaxableHra).toBe(5000);
  });

  it("is zero when no rent is paid", () => {
    const result = calculateHraExemption(
      {
        monthlyBasicSalary: 30000,
        monthlyHraReceived: 15000,
        monthlyRentPaid: 0,
        isMetroCity: true,
      },
      config
    );
    expect(result.monthlyExemptAmount).toBe(0);
    expect(result.monthlyTaxableHra).toBe(15000);
  });

  it("never returns a negative exempt amount", () => {
    const result = calculateHraExemption(
      {
        monthlyBasicSalary: 30000,
        monthlyHraReceived: 0,
        monthlyRentPaid: 1000,
        isMetroCity: true,
      },
      config
    );
    expect(result.monthlyExemptAmount).toBe(0);
  });
});
