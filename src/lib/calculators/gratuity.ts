export interface GratuityResult {
  isEligible: boolean;
  gratuityAmount: number;
}

// Payment of Gratuity Act, 1972: (15 x last drawn monthly salary x years of
// service) / 26, with a minimum of 5 years of continuous service to be
// eligible (barring death/disablement, which this doesn't model).
export function calculateGratuity(
  lastDrawnMonthlySalary: number,
  yearsOfService: number,
  minYearsOfServiceForEligibility: number,
  numeratorDays: number,
  divisor: number
): GratuityResult {
  const isEligible = yearsOfService >= minYearsOfServiceForEligibility;
  if (!isEligible) {
    return { isEligible, gratuityAmount: 0 };
  }
  const roundedYears = Math.round(yearsOfService);
  return {
    isEligible,
    gratuityAmount:
      (numeratorDays * lastDrawnMonthlySalary * roundedYears) / divisor,
  };
}
