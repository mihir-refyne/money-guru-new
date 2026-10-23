import calculatorsConfig from "./config";
import {
  calculateMonthlyEmployeePfContribution,
  calculateMonthlyEmployerPfContribution,
} from "./pf";
import { calculateIncomeTax, calculateTaxableIncome } from "./tax";

export interface CtcToInHandInput {
  annualCtc: number;
}

export interface CtcToInHandResult {
  monthlyBasicSalary: number;
  monthlyEmployeePf: number;
  monthlyEmployerPf: number;
  monthlyProfessionalTax: number;
  monthlyIncomeTax: number;
  annualIncomeTax: number;
  monthlyInHandSalary: number;
  annualInHandSalary: number;
}

// Simplified estimate: CTC is treated as gross monthly salary (basic + the
// rest) plus employer PF, with only basic/PF/professional tax/income tax
// deducted. It does not model gratuity, bonus, insurance or other
// perquisites that real payslips often include in CTC — hence "estimate
// only" in the UI.
export function calculateCtcToInHand(
  { annualCtc }: CtcToInHandInput,
  config = calculatorsConfig.ctcToInHand
): CtcToInHandResult {
  const monthlyBasicSalary =
    (annualCtc * config.assumedBasicPercentOfCtc) / 100 / 12;

  const monthlyEmployeePf =
    calculateMonthlyEmployeePfContribution(monthlyBasicSalary);
  const monthlyEmployerPf =
    calculateMonthlyEmployerPfContribution(monthlyBasicSalary);
  const monthlyProfessionalTax = config.assumedMonthlyProfessionalTax;

  const monthlyGrossSalary = annualCtc / 12 - monthlyEmployerPf;
  // New tax regime does not allow an 80C deduction for employee PF, so
  // gross salary (before the employee PF deduction below) is what's taxed.
  const taxableIncome = calculateTaxableIncome(monthlyGrossSalary * 12);
  const annualIncomeTax = calculateIncomeTax(taxableIncome);
  const monthlyIncomeTax = annualIncomeTax / 12;

  const monthlyInHandSalary = Math.max(
    0,
    monthlyGrossSalary -
      monthlyEmployeePf -
      monthlyProfessionalTax -
      monthlyIncomeTax
  );

  return {
    monthlyBasicSalary,
    monthlyEmployeePf,
    monthlyEmployerPf,
    monthlyProfessionalTax,
    monthlyIncomeTax,
    annualIncomeTax,
    monthlyInHandSalary,
    annualInHandSalary: monthlyInHandSalary * 12,
  };
}
