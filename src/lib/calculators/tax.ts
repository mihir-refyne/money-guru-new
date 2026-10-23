import calculatorsConfig, { IncomeTaxSlab } from "./config";

// Progressive slab tax on `taxableIncome`, using `slabs` where each slab's
// `upTo` is its inclusive upper bound (null = no upper bound / top slab).
// Includes the Section 87A rebate (zero tax up to `rebateMaxTaxableIncome`)
// and cess, both config-driven rather than hard-coded.
export function calculateIncomeTax(
  taxableIncome: number,
  config = calculatorsConfig.incomeTax
): number {
  if (taxableIncome <= 0) return 0;
  if (taxableIncome <= config.rebateMaxTaxableIncome) return 0;

  let tax = 0;
  let previousUpTo = 0;

  for (const slab of config.slabs as Array<IncomeTaxSlab>) {
    const slabUpperBound = slab.upTo ?? Infinity;
    const amountInSlab = Math.max(
      0,
      Math.min(taxableIncome, slabUpperBound) - previousUpTo
    );
    tax += (amountInSlab * slab.ratePercent) / 100;
    previousUpTo = slabUpperBound;
    if (taxableIncome <= slabUpperBound) break;
  }

  const cess = (tax * config.cessRatePercent) / 100;
  return tax + cess;
}

export function calculateTaxableIncome(
  annualIncome: number,
  config = calculatorsConfig.incomeTax
): number {
  return Math.max(0, annualIncome - config.standardDeduction);
}
