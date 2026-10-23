import CalculatorInputField from "@/components/CalculatorInputField";
import CalculatorResultCard from "@/components/CalculatorResultCard";
import PageLayout from "@/components/PageLayout";
import useTranslation from "@/hooks/useTranslation";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import { calculateLoanPrepaymentImpact } from "@/lib/calculators/loanPrepayment";
import { formatToInr } from "@/lib/utils";
import { useRouter } from "next/router";
import { useState } from "react";

const NEXT_STEP_PATH = "/calculators/loan-emi";

export default function LoanPrepaymentCalculatorPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [principalInput, setPrincipalInput] = useState("");
  const [rateInput, setRateInput] = useState("");
  const [tenureInput, setTenureInput] = useState("");
  const [prepaymentInput, setPrepaymentInput] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const outstandingPrincipal = Number(principalInput) || 0;
  const annualRatePercent = Number(rateInput) || 0;
  const remainingTenureMonths = Number(tenureInput) || 0;
  const prepaymentAmount = Number(prepaymentInput) || 0;
  const hasError =
    hasSubmitted &&
    (outstandingPrincipal <= 0 ||
      annualRatePercent <= 0 ||
      remainingTenureMonths <= 0 ||
      prepaymentAmount <= 0);

  const result =
    hasSubmitted && !hasError
      ? calculateLoanPrepaymentImpact({
          outstandingPrincipal,
          annualRatePercent,
          remainingTenureMonths,
          prepaymentAmount,
        })
      : null;

  function handleInputChange(setter: (value: string) => void) {
    return (value: string) => {
      setter(value);
      setHasSubmitted(false);
    };
  }

  function handleCalculate() {
    setHasSubmitted(true);
    if (
      outstandingPrincipal <= 0 ||
      annualRatePercent <= 0 ||
      remainingTenureMonths <= 0 ||
      prepaymentAmount <= 0
    )
      return;
    logMoneyGuruEvent(AnalyticEvent.CALCULATOR_RUN, { type: "loan_prepayment" });
  }

  function handleNextStepClick() {
    logMoneyGuruEvent(AnalyticEvent.NEXT_STEP_CLICKED, {
      destination: NEXT_STEP_PATH,
    });
    router.push(NEXT_STEP_PATH);
  }

  return (
    <PageLayout navbarText={t("money_guru_loan_prepayment_calculator_title")}>
      <CalculatorInputField
        label={t("money_guru_loan_prepayment_principal_label")}
        type="currency"
        value={principalInput}
        hasError={hasError}
        onChange={handleInputChange(setPrincipalInput)}
      />
      <CalculatorInputField
        label={t("money_guru_loan_prepayment_rate_label")}
        type="number"
        value={rateInput}
        hasError={hasError}
        onChange={handleInputChange(setRateInput)}
      />
      <CalculatorInputField
        label={t("money_guru_loan_prepayment_tenure_label")}
        type="number"
        value={tenureInput}
        hasError={hasError}
        onChange={handleInputChange(setTenureInput)}
      />
      <CalculatorInputField
        label={t("money_guru_loan_prepayment_amount_label")}
        type="currency"
        value={prepaymentInput}
        hasError={hasError}
        errorMessage={t("money_guru_loan_prepayment_error")}
        onChange={handleInputChange(setPrepaymentInput)}
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
          summary={t("money_guru_loan_prepayment_summary")}
          lineItems={[
            {
              label: t("money_guru_loan_prepayment_interest_saved"),
              value: formatToInr(result.interestSaved),
              emphasis: true,
            },
            {
              label: t("money_guru_loan_prepayment_tenure_reduced"),
              value: `${Math.round(result.tenureReducedMonths)} ${t(
                "money_guru_loan_prepayment_months_suffix"
              )}`,
            },
            {
              label: t("money_guru_loan_prepayment_new_tenure"),
              value: `${Math.round(result.newRemainingTenureMonths)} ${t(
                "money_guru_loan_prepayment_months_suffix"
              )}`,
            },
          ]}
          nextStepLabel={t("money_guru_loan_prepayment_next_step")}
          onNextStepClick={handleNextStepClick}
        />
      )}
    </PageLayout>
  );
}
