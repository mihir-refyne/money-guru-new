export interface TermInsuranceInput {
  annualIncome: number;
  numberOfDependents: number;
  outstandingLiabilities: number;
  existingSavingsAndCover: number;
}

// A common rule-of-thumb (human life value, simplified): cover needed =
// (annual income x a multiplier that scales with dependents) + outstanding
// loans - what's already set aside. This is guidance, not a recommendation
// for a specific policy or insurer.
export function calculateSuggestedTermCover(
  input: TermInsuranceInput,
  baseIncomeMultiplier: number,
  perDependentMultiplier: number
): number {
  const {
    annualIncome,
    numberOfDependents,
    outstandingLiabilities,
    existingSavingsAndCover,
  } = input;

  const multiplier =
    baseIncomeMultiplier + perDependentMultiplier * numberOfDependents;
  const suggestedCover =
    annualIncome * multiplier +
    outstandingLiabilities -
    existingSavingsAndCover;

  return Math.max(0, suggestedCover);
}
