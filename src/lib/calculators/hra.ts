import calculatorsConfig from "./config";

export interface HraExemptionInput {
  monthlyBasicSalary: number;
  monthlyHraReceived: number;
  monthlyRentPaid: number;
  isMetroCity: boolean;
}

export interface HraExemptionResult {
  monthlyExemptAmount: number;
  monthlyTaxableHra: number;
}

// HRA exemption (Section 10(13A)) is the LEAST of:
// 1. HRA actually received
// 2. Rent paid minus 10% of basic
// 3. 50% of basic (metro) / 40% of basic (non-metro)
export function calculateHraExemption(
  input: HraExemptionInput,
  config = calculatorsConfig.hra
): HraExemptionResult {
  const { monthlyBasicSalary, monthlyHraReceived, monthlyRentPaid, isMetroCity } =
    input;

  const rentMinusThreshold = Math.max(
    0,
    monthlyRentPaid - (monthlyBasicSalary * config.rentThresholdPercentOfBasic) / 100
  );
  const percentOfBasicLimit =
    (monthlyBasicSalary *
      (isMetroCity
        ? config.metroExemptionPercentOfBasic
        : config.nonMetroExemptionPercentOfBasic)) /
    100;

  const monthlyExemptAmount = Math.max(
    0,
    Math.min(monthlyHraReceived, rentMinusThreshold, percentOfBasicLimit)
  );

  return {
    monthlyExemptAmount,
    monthlyTaxableHra: Math.max(0, monthlyHraReceived - monthlyExemptAmount),
  };
}
