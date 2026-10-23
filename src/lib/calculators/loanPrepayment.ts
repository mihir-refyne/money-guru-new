import { calculateEMI, calculateMonthsToPayOff } from "./emi";

export interface LoanPrepaymentInput {
  outstandingPrincipal: number;
  annualRatePercent: number;
  remainingTenureMonths: number;
  prepaymentAmount: number;
}

export interface LoanPrepaymentResult {
  currentEmi: number;
  newRemainingTenureMonths: number;
  tenureReducedMonths: number;
  originalRemainingInterest: number;
  newRemainingInterest: number;
  interestSaved: number;
}

// Keeps the existing EMI fixed and recomputes how many months are left once
// `prepaymentAmount` is knocked off the outstanding principal.
export function calculateLoanPrepaymentImpact(
  input: LoanPrepaymentInput
): LoanPrepaymentResult {
  const {
    outstandingPrincipal,
    annualRatePercent,
    remainingTenureMonths,
    prepaymentAmount,
  } = input;

  const currentEmi = calculateEMI(
    outstandingPrincipal,
    annualRatePercent,
    remainingTenureMonths
  );
  const originalRemainingInterest =
    currentEmi * remainingTenureMonths - outstandingPrincipal;

  const newPrincipal = Math.max(
    0,
    outstandingPrincipal - Math.min(prepaymentAmount, outstandingPrincipal)
  );

  if (newPrincipal === 0) {
    return {
      currentEmi,
      newRemainingTenureMonths: 0,
      tenureReducedMonths: remainingTenureMonths,
      originalRemainingInterest,
      newRemainingInterest: 0,
      interestSaved: originalRemainingInterest,
    };
  }

  const newRemainingTenureMonths =
    calculateMonthsToPayOff(newPrincipal, annualRatePercent, currentEmi) ?? 0;
  const newRemainingInterest =
    currentEmi * newRemainingTenureMonths - newPrincipal;

  return {
    currentEmi,
    newRemainingTenureMonths,
    tenureReducedMonths: remainingTenureMonths - newRemainingTenureMonths,
    originalRemainingInterest,
    newRemainingInterest,
    interestSaved: originalRemainingInterest - newRemainingInterest,
  };
}
