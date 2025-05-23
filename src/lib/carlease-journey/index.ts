import { logAnalyticsEvent } from "../analytics";
import { AnalyticEvent } from "../analytics/events";

export interface InputContainerProps {
  value?: string | number;
  label: string;
  inputFieldType?: "text" | "number" | "currency" | "date";
  maxLength?: number;
  placeHolderText?: string;
  fontSize?: string;
  fontWeight?: string;
  hasError?: boolean;
  errorMessage?: string;
  color?: string;
  isNewCar?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface LeaseCalculatorFormInput {
  exShowroomPrice: number; // Base Price + GST and Cess
  roadTaxPercentage: number; // Road Tax as percentage of exShowroomPrice
  residualValuePercentage: number; // Default 36%
  tenureYears: number; // 1, 2, 3, 4, or 5 years
  isNewCar: boolean; // true for new car, false for old car
  errors: {
    exShowroomPrice?: string;
    roadTaxPercentage?: string;
    residualValuePercentage?: string;
    tenureYears?: string;
    isNewCar?: string;
  };
}

export interface TaxBenefitsProps {
  employeeSalary: number;
  onRoadPrice: number;
  tenure: number;
  driverSalary: number;
  fuelMaintenanceCost: number;
  residualValue: number;
  gstRate: number;
  cess: number;
  roadTaxRate: number;
  financeRental: number;
  basicRental: number;
  totalLeaseRental: number;
  interestRate: number;
  isNewCar?: boolean;
  errors: {
    employeeSalary?: string;
    onRoadPrice?: string;
    tenure?: string;
    driverSalary?: string;
    fuelMaintenanceCost?: string;
    residualValue?: string;
    gstRate?: string;
    cess?: string;
    roadTaxRate?: string;
    financeRental?: string;
    basicRental?: string;
    totalLeaseRental?: string;
    interestRate?: string;
    isNewCar?: string;
  };
}

export interface CarSummaryValues {
  monthlyPayments: string;
  totalAnnualPayments: string;
  residualValuePayment: string;
  totalPaymentOverTenure: string;
}

export interface ComparisonTableDataType {
  label: string;
  carLeaseValue: string;
  carLoanValue: string;
}

export interface ComparisonTableDataType {
  label: string;
  carLeaseValue: string;
  carLoanValue: string;
}

export interface UserCarleaseDetailsProps {
  fullName: string;
  mobileNumber: string;
  dateOfBirth: string;
  employerName: string;
  leaseDuration: number;
  // governmentID: string;
  // employmentType: string;
  // monthlyIncome: string;
  // preferredCarModel: string;
  errors: {
    fullName?: string;
    mobileNumber?: string;
    dateOfBirth?: string;
    employerName?: string;
    leaseDuration?: string;
    // governmentID?: string;
    // employmentType?: string;
    // monthlyIncome?: string;
    // preferredCarModel?: string;
  };
}

export enum ProcessType {
  NEW_CAR = "New Car",
  OLD_CAR = "Old Car",
}

// Types for input and output
export type LeaseCalculatorInput = {
  exShowroomPrice: number; // Base Price + GST and Cess
  roadTaxPercentage: number; // Road Tax as percentage of exShowroomPrice
  residualValuePercentage: number; // Default 36%
  tenureYears: number; // 1, 2, 3, 4, or 5 years
  isNewCar: boolean; // true for new car, false for old car
};

export type LeaseCalculatorOutput = {
  monthlyPayment: number; // Step 13: Lease Rentals
  totalAnnualPayments: number; // Monthly payment * 12
  residualValuePayment: number; // Step 2: Selected RV
  totalPaymentOverTenure: number; // Monthly payment * tenure in months + residual value

  // Additional details for transparency
  calculationDetails: {
    onRoadPrice: number;
    roadTaxTotal: number;
    residualValue36Percent: number; // Step 1
    selectedResidualValue: number; // Step 2
    differenceInRV: number; // Step 3
    pvOfDifferenceInRV: number; // Step 4
    dividedPVAmount: number; // Step 5
    loanAmount: number; // Step 6: On-road price
    emiOnLoanAmount: number; // Step 7
    totalRentalsWithGST: number; // Step 8
    fmsChargesWithGST: number; // Step 9
    roadTaxPerMonth: number; // Step 10
    basicRentalsIncludingGST: number; // Step 11
    basicRentals: number; // Step 12
    leaseRentals: number; // Step 13
  };
};

/**
 * Calculates the EMI (Equated Monthly Installment) for a loan
 * @param principal The loan amount
 * @param ratePerAnnum Annual interest rate (in percentage)
 * @param tenureMonths Loan tenure in months
 * @returns Monthly EMI amount
 */
function calculateEMI(
  principal: number,
  ratePerAnnum: number,
  tenureMonths: number
): number {
  // Convert annual interest rate to monthly rate
  const monthlyRate = ratePerAnnum / 12 / 100;

  // Calculate EMI using the formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  return emi;
}

/**
 * Calculates the present value (PV) of a future sum
 * @param futureValue Future value amount
 * @param ratePerAnnum Annual interest rate (in percentage)
 * @param tenureMonths Time period in months
 * @returns Present value of the future sum
 */
function calculatePresentValue(
  futureValue: number,
  ratePerAnnum: number,
  tenureMonths: number
): number {
  // Convert annual interest rate to monthly rate
  const monthlyRate = ratePerAnnum / 12 / 100;

  // Calculate PV using the formula: FV / (1+r)^n
  const pv = futureValue / Math.pow(1 + monthlyRate, tenureMonths);

  return pv;
}

/**
 * Calculates car lease details based on user inputs
 * @param input User inputs for lease calculation
 * @returns Calculated lease details
 */
export function calculateCarLease(
  input: LeaseCalculatorInput
): LeaseCalculatorOutput {
  const {
    exShowroomPrice,
    roadTaxPercentage,
    residualValuePercentage,
    tenureYears,
    isNewCar,
  } = input;

  // Set interest rate based on car type
  const interestRate = isNewCar ? 9.35 : 14.5;

  // Calculate Road Tax (zero for old car)
  const roadTaxTotal = isNewCar
    ? exShowroomPrice * (roadTaxPercentage / 100)
    : 0;

  // Calculate On-Road Price
  const onRoadPrice = exShowroomPrice + roadTaxTotal;

  // Step 1: Calculate RV @ 36%
  const residualValue36Percent = onRoadPrice * 0.36;

  // Step 2: Selected RV based on user input
  const selectedResidualValue = onRoadPrice * (residualValuePercentage / 100);

  // Step 3: Difference between Step 1 and Step 2
  const differenceInRV = residualValue36Percent - selectedResidualValue;

  // Convert tenure to months
  const tenureMonths = tenureYears * 12;

  // Step 4: Bring the difference in RV to PV terms
  const pvOfDifferenceInRV = calculatePresentValue(
    differenceInRV,
    interestRate,
    tenureMonths
  );

  // Step 5: Divide the PV amount by tenure in months
  const dividedPVAmount = pvOfDifferenceInRV / tenureMonths;

  // Step 6: Loan Amount (On-Road Price)
  const loanAmount = onRoadPrice;

  // Step 7: Calculate EMI on loan amount
  const emiOnLoanAmount = calculateEMI(loanAmount, interestRate, tenureMonths);

  // Step 8: Add amounts from Step 5 & 7 to get Total Rentals with GST
  const totalRentalsWithGST = dividedPVAmount + emiOnLoanAmount;

  // Step 9: Calculate FMS Charges + GST
  const fmsChargesWithGST = onRoadPrice * 0.0035 * 1.18; // 0.35% with 18% GST

  // Step 10: Road tax per month
  const roadTaxPerMonth = isNewCar ? roadTaxTotal / tenureMonths : 0;

  // Step 11: Basic Rentals Including GST
  const basicRentalsIncludingGST =
    totalRentalsWithGST - fmsChargesWithGST - roadTaxPerMonth;

  // Step 12: Basic Rentals (without GST)
  // GST rate is 28% + 1% cess = 29% total
  const basicRentals = basicRentalsIncludingGST / 1.29;

  // Step 13: Lease Rentals (amount to be collected)
  const leaseRentals = totalRentalsWithGST;

  // Calculate output values
  const monthlyPayment = leaseRentals;
  const totalAnnualPayments = monthlyPayment * 12;
  const residualValuePayment = selectedResidualValue;
  const totalPaymentOverTenure =
    monthlyPayment * tenureMonths + residualValuePayment;

  return {
    monthlyPayment,
    totalAnnualPayments,
    residualValuePayment,
    totalPaymentOverTenure,
    calculationDetails: {
      onRoadPrice,
      roadTaxTotal,
      residualValue36Percent,
      selectedResidualValue,
      differenceInRV,
      pvOfDifferenceInRV,
      dividedPVAmount,
      loanAmount,
      emiOnLoanAmount,
      totalRentalsWithGST,
      fmsChargesWithGST,
      roadTaxPerMonth,
      basicRentalsIncludingGST,
      basicRentals,
      leaseRentals,
    },
  };
}

/**
 * Calculates regular car loan EMI for comparison
 * @param carPrice Total car price (usually on-road price)
 * @param downPaymentPercent Down payment percentage (e.g., 20 for 20%)
 * @param interestRate Annual interest rate
 * @param tenureYears Loan tenure in years
 * @returns Monthly EMI and other loan details
 */
export function calculateCarLoanEMI(
  carPrice: number,
  downPaymentPercent: number,
  interestRate: number,
  tenureYears: number
): {
  monthlyEMI: number;
  totalInterest: number;
  totalAmount: number;
  downPayment: number;
  loanAmount: number;
} {
  // Calculate down payment and loan amount
  const downPayment = carPrice * (downPaymentPercent / 100);
  const loanAmount = carPrice - downPayment;

  // Calculate monthly EMI
  const tenureMonths = tenureYears * 12;
  const monthlyEMI = calculateEMI(loanAmount, interestRate, tenureMonths);

  // Calculate total amount and interest
  const totalAmount = monthlyEMI * tenureMonths;
  const totalInterest = totalAmount - loanAmount;

  return {
    monthlyEMI,
    totalInterest,
    totalAmount,
    downPayment,
    loanAmount,
  };
}

/**
 * Compare car lease vs car loan
 * @param leaseDetails Lease calculation output
 * @param loanDetails Loan calculation output
 * @returns Comparison data between lease and loan
 */
export function compareLeaseVsLoan(
  leaseDetails: LeaseCalculatorOutput,
  loanDetails: {
    monthlyEMI: number;
    totalInterest: number;
    totalAmount: number;
    downPayment: number;
    loanAmount: number;
  }
): {
  monthlySavings: number; // Positive if lease is cheaper
  totalSavings: number; // Positive if lease is cheaper over tenure
  effectiveInterestRate: number; // Effective interest rate for lease
} {
  const { monthlyPayment, totalPaymentOverTenure } = leaseDetails;
  const { monthlyEMI, totalAmount, downPayment } = loanDetails;

  const monthlySavings = monthlyEMI - monthlyPayment;
  const totalSavings = downPayment + totalAmount - totalPaymentOverTenure;

  // Calculate effective interest rate for the lease
  // This is a simplification and not exact
  const loanAmount = leaseDetails.calculationDetails.onRoadPrice;
  const tenureMonths =
    leaseDetails.calculationDetails.loanAmount / leaseDetails.monthlyPayment;

  // Using the EMI formula in reverse to find r (rate)
  // This is an approximation and would require iterative methods for exact values
  const effectiveInterestRate =
    ((monthlyPayment * tenureMonths) / loanAmount - 1) * 12 * 100;

  return {
    monthlySavings,
    totalSavings,
    effectiveInterestRate: Math.max(0, effectiveInterestRate), // Prevent negative rates
  };
}

export async function postCarleaseData(carLeaseValues: CarSummaryValues) {
  logAnalyticsEvent(
    ["mixpanel", "webengage"],
    AnalyticEvent.CAR_LEASE_TAX_SUMMARY_DATA,
    {
      ...carLeaseValues,
    }
  );
  const response = await fetch("/api/post-carlease-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(carLeaseValues),
  });

  if (!response.ok) {
    throw new Error("Failed to submit car lease data");
  }

  return await response.json();
}

export async function postCarleaseUserFormData({
  fullName,
  mobileNumber,
  dateOfBirth,
  employerName,
  leaseDuration,
}: {
  fullName: string;
  mobileNumber: string;
  dateOfBirth: string;
  employerName: string;
  leaseDuration: number;
}) {
  logAnalyticsEvent(
    ["mixpanel", "webengage"],
    AnalyticEvent.CAR_LEASE_USER_DETAILS_DATA,
    {
      fullName,
      mobileNumber,
      dateOfBirth,
      employerName,
      leaseDuration,
    }
  );
  const response = await fetch("/api/post-user-carlease-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName,
      mobileNumber,
      dateOfBirth,
      employerName,
      leaseDuration,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit user car lease data");
  }

  return await response.json();
}
