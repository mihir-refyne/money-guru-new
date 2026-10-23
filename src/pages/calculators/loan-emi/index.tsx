import CalculatorInputField from "@/components/CalculatorInputField";
import CalculatorResultCard from "@/components/CalculatorResultCard";
import PageLayout from "@/components/PageLayout";
import useTranslation from "@/hooks/useTranslation";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import calculatorsConfig from "@/lib/calculators/config";
import { calculateEMI, calculateTotalInterest } from "@/lib/calculators/emi";
import { formatToInr } from "@/lib/utils";
import { useRouter } from "next/router";
import { useState } from "react";

const NEXT_STEP_PATH = "/calculators/loan-prepayment";

export default function LoanEmiCalculatorPage() {
  const { t, tWithoutTypeSafety } = useTranslation("common");
  const router = useRouter();
  const loanTypes = calculatorsConfig.loanEmi.loanTypes;

  const [loanType, setLoanType] = useState(loanTypes[0].value);
  const [amountInput, setAmountInput] = useState("");
  const [rateInput, setRateInput] = useState(
    loanTypes[0].defaultRatePercent.toString()
  );
  const [tenureInput, setTenureInput] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const loanAmount = Number(amountInput) || 0;
  const annualRatePercent = Number(rateInput) || 0;
  const tenureMonths = Number(tenureInput) || 0;
  const hasError =
    hasSubmitted && (loanAmount <= 0 || annualRatePercent <= 0 || tenureMonths <= 0);

  const result =
    hasSubmitted && !hasError
      ? {
          emi: calculateEMI(loanAmount, annualRatePercent, tenureMonths),
          totalInterest: calculateTotalInterest(
            loanAmount,
            annualRatePercent,
            tenureMonths
          ),
        }
      : null;

  function handleLoanTypeChange(value: string) {
    setLoanType(value);
    const matchingType = loanTypes.find((type) => type.value === value);
    if (matchingType) setRateInput(matchingType.defaultRatePercent.toString());
    setHasSubmitted(false);
  }

  function handleInputChange(setter: (value: string) => void) {
    return (value: string) => {
      setter(value);
      setHasSubmitted(false);
    };
  }

  function handleCalculate() {
    setHasSubmitted(true);
    if (loanAmount <= 0 || annualRatePercent <= 0 || tenureMonths <= 0) return;
    logMoneyGuruEvent(AnalyticEvent.CALCULATOR_RUN, {
      type: "loan_emi",
      loan_type: loanType,
    });
  }

  function handleNextStepClick() {
    logMoneyGuruEvent(AnalyticEvent.NEXT_STEP_CLICKED, {
      destination: NEXT_STEP_PATH,
    });
    router.push(NEXT_STEP_PATH);
  }

  return (
    <PageLayout navbarText={t("money_guru_loan_emi_calculator_title")}>
      <p className="text-caption clr-text-secondary mb-4">
        {t("money_guru_loan_emi_calculator_type_label")}
      </p>
      <div className="mb-4" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {loanTypes.map((type) => (
          <button
            key={type.value}
            type="button"
            className={`btn ${
              loanType === type.value ? "btn-primary" : "btn-primary-outline"
            }`}
            onClick={() => handleLoanTypeChange(type.value)}
          >
            {tWithoutTypeSafety(type.labelKey)}
          </button>
        ))}
      </div>

      <CalculatorInputField
        label={t("money_guru_loan_emi_calculator_amount_label")}
        type="currency"
        value={amountInput}
        hasError={hasError}
        onChange={handleInputChange(setAmountInput)}
      />
      <CalculatorInputField
        label={t("money_guru_loan_emi_calculator_rate_label")}
        type="number"
        value={rateInput}
        hasError={hasError}
        onChange={handleInputChange(setRateInput)}
      />
      <CalculatorInputField
        label={t("money_guru_loan_emi_calculator_tenure_label")}
        type="number"
        value={tenureInput}
        hasError={hasError}
        errorMessage={t("money_guru_loan_emi_calculator_error")}
        onChange={handleInputChange(setTenureInput)}
      />

      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={handleCalculate}
      >
        {t("money_guru_calculator_calculate_cta")}
      </button>

      {result && (
        <CalculatorResultCard
          summary={t("money_guru_loan_emi_calculator_summary")}
          lineItems={[
            {
              label: t("money_guru_loan_emi_calculator_emi"),
              value: formatToInr(result.emi),
              emphasis: true,
            },
            {
              label: t("money_guru_loan_emi_calculator_total_interest"),
              value: formatToInr(result.totalInterest),
            },
            {
              label: t("money_guru_loan_emi_calculator_total_cost"),
              value: formatToInr(loanAmount + result.totalInterest),
            },
          ]}
          nextStepLabel={t("money_guru_loan_emi_calculator_next_step")}
          onNextStepClick={handleNextStepClick}
        />
      )}
    </PageLayout>
  );
}
