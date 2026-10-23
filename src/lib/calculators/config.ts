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
}

export default calculatorsConfig as CalculatorsConfig;
