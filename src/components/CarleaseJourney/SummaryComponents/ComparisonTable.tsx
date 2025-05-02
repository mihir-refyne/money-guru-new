import {
  CarSummaryValues,
  ComparisonTableDataType,
  LeaseCalculatorInput,
  TaxBenefitsProps,
  calculateCarLease,
} from "@/lib/carlease-journey";
import { formatToInr } from "@/lib/utils";
import { useRouter } from "next/router";
import { useMemo } from "react";

function parseAndCalculateCarLoanValues(userForm?: string): CarSummaryValues {
  if (!userForm) {
    return {
      monthlyPayments: "-",
      totalAnnualPayments: "-",
      residualValuePayment: "-",
      totalPaymentOverTenure: "-",
    };
  }

  try {
    const decodedUserFormData: TaxBenefitsProps = JSON.parse(
      decodeURIComponent(userForm)
    );

    const { onRoadPrice, tenure, interestRate } = decodedUserFormData;

    const monthlyInterestRate = interestRate / 12 / 100;
    const loanTenureMonths = tenure * 12;

    let monthlyPayments =
      (onRoadPrice *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, loanTenureMonths)) /
      (Math.pow(1 + monthlyInterestRate, loanTenureMonths) - 1);

    const totalAnnualPayments = monthlyPayments * 12;
    const totalPaymentOverTenure = monthlyPayments * loanTenureMonths;

    return {
      monthlyPayments: formatToInr(monthlyPayments),
      totalAnnualPayments: formatToInr(totalAnnualPayments),
      residualValuePayment: "-",
      totalPaymentOverTenure: formatToInr(totalPaymentOverTenure),
    };
  } catch (error) {
    console.log("Error calculating car loan values!");
    return {
      monthlyPayments: "-",
      totalAnnualPayments: "-",
      residualValuePayment: "-",
      totalPaymentOverTenure: "-",
    };
  }
}

function parseAndCalculateCarLeaseValues(
  userForm?: string | undefined
): CarSummaryValues {
  if (!userForm) {
    return {
      monthlyPayments: "-",
      totalAnnualPayments: "-",
      residualValuePayment: "-",
      totalPaymentOverTenure: "-",
    };
  }

  try {
    const decodedUserFormData: TaxBenefitsProps = JSON.parse(
      decodeURIComponent(userForm)
    );

    const { totalLeaseRental, onRoadPrice, residualValue, tenure } =
      decodedUserFormData;

    const monthlyPayments = totalLeaseRental;
    const totalAnnualPayments = totalLeaseRental * 12;
    const residualValuePayment = onRoadPrice * residualValue;
    const totalPaymentOverTenure =
      totalLeaseRental * (tenure * 12) + residualValuePayment;

    return {
      monthlyPayments: formatToInr(monthlyPayments),
      totalAnnualPayments: formatToInr(totalAnnualPayments),
      residualValuePayment: formatToInr(residualValuePayment),
      totalPaymentOverTenure: formatToInr(totalPaymentOverTenure),
    };
  } catch (error) {
    console.log("Something Went Wrong! While Parsing Data");
    return {
      monthlyPayments: "-",
      totalAnnualPayments: "-",
      residualValuePayment: "-",
      totalPaymentOverTenure: "-",
    };
  }
}

export function parseCarLeaseUserFormParamValues(
  userForm?: string
): CarSummaryValues {
  if (!userForm) {
    return {
      monthlyPayments: "-",
      totalAnnualPayments: "-",
      residualValuePayment: "-",
      totalPaymentOverTenure: "-",
    };
  }

  try {
    const decodedUserFormData: LeaseCalculatorInput = JSON.parse(
      decodeURIComponent(userForm)
    );

    const leaseCalculatorOutput = calculateCarLease(decodedUserFormData);

    return {
      monthlyPayments: formatToInr(leaseCalculatorOutput.monthlyPayment),
      totalAnnualPayments: formatToInr(
        leaseCalculatorOutput.totalAnnualPayments
      ),
      residualValuePayment: formatToInr(
        leaseCalculatorOutput.residualValuePayment
      ),
      totalPaymentOverTenure: formatToInr(
        leaseCalculatorOutput.totalPaymentOverTenure
      ),
    };
  } catch (error) {
    console.log("Error calculating car loan values!");
    return {
      monthlyPayments: "-",
      totalAnnualPayments: "-",
      residualValuePayment: "-",
      totalPaymentOverTenure: "-",
    };
  }
}

export const CarLeaseAndLoanComparisonTable = () => {
  const router = useRouter();
  const { userForm } = router.query;

  const carLeaseValues = useMemo(
    () => parseCarLeaseUserFormParamValues(userForm as string),
    [userForm]
  );

  const carLoanValues = useMemo(
    () => parseAndCalculateCarLoanValues(userForm as string),
    [userForm]
  );

  const comparisonData: ComparisonTableDataType[] = [
    {
      label: "Monthly Payments",
      carLeaseValue: carLeaseValues.monthlyPayments,
      carLoanValue: carLoanValues.monthlyPayments,
    },
    {
      label: "Total Annual Payments",
      carLeaseValue: carLeaseValues.totalAnnualPayments,
      carLoanValue: carLoanValues.totalAnnualPayments,
    },

    {
      label: "Residual Value Payment",
      carLeaseValue: carLeaseValues.residualValuePayment,
      carLoanValue: carLoanValues.residualValuePayment,
    },
    {
      label: "Total Payment over the Tenure",
      carLeaseValue: carLeaseValues.totalPaymentOverTenure,
      carLoanValue: carLoanValues.totalPaymentOverTenure,
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        padding: "16px 12px",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          backgroundColor: "#f9f9f9",
        }}
      >
        <div
          style={{
            flex: 2,
            padding: "10px 16px",
            fontWeight: 600,
            fontSize: "14px",
            color: "#666666",
            maxWidth: "130px",
            width: "100%",
          }}
        ></div>
        <div
          style={{
            flex: 1,
            position: "relative",
            padding: "10px 16px",
            textAlign: "center",
            fontWeight: 600,
            fontSize: "14px",
            backgroundColor: "white",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            borderBottom: "0.5px solid #e0e0e0",
            borderLeft: "10px solid white",
            color: "#666666",
            maxWidth: "180px",
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p> Car Lease</p>
          {/* <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              marginTop: "12px",
              width: "0.5px",
              backgroundColor: "#e0e0e0",
            }}
          /> */}
        </div>
        {/* <div
          style={{
            flex: 1,
            padding: "10px 16px",
            textAlign: "center",
            fontWeight: 600,
            fontSize: "14px",
            backgroundColor: "white",
            color: "#666666",
            borderTopRightRadius: "8px",
            borderRight: "10px solid white",
            borderBottom: "0.5px solid #e0e0e0",
            maxWidth: "180px",
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p> Car Loan</p>
        </div> */}
      </div>

      {comparisonData.map((item, index) => (
        <ComparisonTableRowData
          key={index}
          index={index}
          rowDataItem={item}
          rowDataLength={comparisonData.length}
        />
      ))}
    </div>
  );
};

const ComparisonTableRowData = ({
  rowDataItem,
  index,
  rowDataLength,
}: {
  rowDataItem: ComparisonTableDataType;
  index: number;
  rowDataLength: number;
}) => {
  return (
    <div
      key={index}
      style={{
        display: "flex",
      }}
    >
      <div
        style={{
          flex: 2,
          padding: "10px 14px",
          fontWeight: 400,
          fontSize: "12px",
          backgroundColor: "var(--clr-background-surface)",
          color: "var(--clr-pure-grey)",
          maxWidth: "130px",
          width: "100%",
        }}
      >
        {rowDataItem.label}
      </div>
      <div
        style={{
          flex: 1,
          position: "relative",
          padding: "10px 12px",
          textAlign: "center",
          fontWeight: 400,
          fontSize: "12px",
          color: "#121212",
          backgroundColor: "white",
          borderBottom:
            rowDataLength - 1 == index ? "none" : "0.5px solid #e0e0e0",
          borderLeft: "10px solid white",
          borderBottomLeftRadius: rowDataLength - 1 == index ? "8px" : "0",
          borderBottomRightRadius: rowDataLength - 1 == index ? "8px" : "0",
          maxWidth: "180px",
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>{rowDataItem.carLeaseValue}</p>
        {/* <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "0.5px",
            marginBottom: rowDataLength - 1 == index ? "12px" : "0px",
            backgroundColor: "#e0e0e0",
          }}
        /> */}
      </div>
      {/* <div
        style={{
          flex: 1,
          padding: "10px 12px",
          textAlign: "center",
          fontWeight: 400,
          fontSize: "12px",
          color: "#121212",
          backgroundColor: "white",
          borderRight: "10px solid white",
          borderBottom:
            rowDataLength - 1 == index ? "none" : "0.5px solid #e0e0e0",
          borderBottomRightRadius: rowDataLength - 1 == index ? "8px" : "0",
          maxWidth: "180px",
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      > */}
      {/* <p>{rowDataItem.carLoanValue}</p> */}
      {/* </div> */}
    </div>
  );
};
