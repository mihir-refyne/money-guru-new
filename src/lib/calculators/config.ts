import calculatorsConfig from "../../../data/calculators_config.json";

export interface IncomeTaxSlab {
  upTo: number | null;
  ratePercent: number;
}

export interface CalculatorsConfig {
  incomeTax: {
    regimeLabel: string;
    standardDeduction: number;
    cessRatePercent: number;
    rebateMaxTaxableIncome: number;
    slabs: Array<IncomeTaxSlab>;
  };
  providentFund: {
    employeeContributionRatePercent: number;
    employerContributionRatePercent: number;
    monthlyWageCeiling: number;
  };
  ctcToInHand: {
    assumedBasicPercentOfCtc: number;
    assumedMonthlyProfessionalTax: number;
  };
  hra: {
    metroExemptionPercentOfBasic: number;
    nonMetroExemptionPercentOfBasic: number;
    rentThresholdPercentOfBasic: number;
  };
  loanEmi: {
    loanTypes: Array<{
      value: string;
      labelKey: string;
      defaultRatePercent: number;
    }>;
  };
  sip: { assumedAnnualReturnPercent: number };
  lumpsum: { assumedAnnualReturnPercent: number };
  rd: { assumedAnnualReturnPercent: number };
  emergencyFund: { recommendedMonthsOfCoverage: number };
  inflation: { defaultRatePercent: number };
  ppf: {
    ratePercent: number;
    defaultTenureYears: number;
    maxYearlyContribution: number;
  };
  ssy: {
    ratePercent: number;
    depositYears: number;
    maturityYears: number;
    maxYearlyContribution: number;
  };
  nps: {
    assumedAnnualReturnPercent: number;
    minAnnuityPercent: number;
    assumedAnnuityRatePercent: number;
    retirementAge: number;
  };
  gratuity: {
    minYearsOfServiceForEligibility: number;
    numeratorDays: number;
    divisor: number;
  };
  retirementCorpus: {
    defaultPostRetirementYears: number;
    defaultPreRetirementReturnPercent: number;
  };
  termInsurance: {
    baseIncomeMultiplier: number;
    perDependentMultiplier: number;
  };
}

export default calculatorsConfig as CalculatorsConfig;
