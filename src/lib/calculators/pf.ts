import calculatorsConfig from "./config";

// Employee PF contribution is 12% of "PF wage" (basic + DA here, simplified
// to basic), capped at the statutory monthly wage ceiling unless the basic
// itself is below it.
export function calculateMonthlyEmployeePfContribution(
  monthlyBasicSalary: number,
  config = calculatorsConfig.providentFund
): number {
  const pfWage = Math.min(monthlyBasicSalary, config.monthlyWageCeiling);
  return (pfWage * config.employeeContributionRatePercent) / 100;
}

export function calculateMonthlyEmployerPfContribution(
  monthlyBasicSalary: number,
  config = calculatorsConfig.providentFund
): number {
  const pfWage = Math.min(monthlyBasicSalary, config.monthlyWageCeiling);
  return (pfWage * config.employerContributionRatePercent) / 100;
}
