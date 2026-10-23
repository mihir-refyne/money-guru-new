import CalculatorInputField from "@/components/CalculatorInputField";
import CalculatorResultCard from "@/components/CalculatorResultCard";
import PageLayout from "@/components/PageLayout";
import useTranslation from "@/hooks/useTranslation";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import { calculatePayoff } from "@/lib/calculators/payoff";
import { formatToInr } from "@/lib/utils";
import { useRouter } from "next/router";
import { useState } from "react";

const NEXT_STEP_PATH = "/calculators/loan-prepayment";

export default function DebtPayoffCalculatorPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [balanceInput, setBalanceInput] = useState("");
  const [rateInput, setRateInput] = useState("");
  const [paymentInput, setPaymentInput] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const outstandingBalance = Number(balanceInput) || 0;
  const annualRatePercent = Number(rateInput) || 0;
  const monthlyPayment = Number(paymentInput) || 0;
  const hasMissingFields =
    hasSubmitted &&
    (outstandingBalance <= 0 || annualRatePercent <= 0 || monthlyPayment <= 0);

  const result =
    hasSubmitted && !hasMissingFields
      ? calculatePayoff({ outstandingBalance, annualRatePercent, monthlyPayment })
      : null;
  const paymentTooLow = result !== null && result.monthsToPayOff === null;

  function handleInputChange(setter: (value: string) => void) {
    return (value: string) => {
      setter(value);
      setHasSubmitted(false);
    };
  }

  function handleCalculate() {
    setHasSubmitted(true);
    if (outstandingBalance <= 0 || annualRatePercent <= 0 || monthlyPayment <= 0)
      return;
    logMoneyGuruEvent(AnalyticEvent.CALCULATOR_RUN, { type: "debt_payoff" });
  }

  function handleNextStepClick() {
    logMoneyGuruEvent(AnalyticEvent.NEXT_STEP_CLICKED, {
      destination: NEXT_STEP_PATH,
    });
    router.push(NEXT_STEP_PATH);
  }

  return (
    <PageLayout navbarText={t("money_guru_debt_payoff_calculator_title")}>
      <CalculatorInputField
        label={t("money_guru_debt_payoff_balance_label")}
        type="currency"
        value={balanceInput}
        hasError={hasMissingFields}
        onChange={handleInputChange(setBalanceInput)}
      />
      <CalculatorInputField
        label={t("money_guru_debt_payoff_rate_label")}
        type="number"
        value={rateInput}
        hasError={hasMissingFields}
        onChange={handleInputChange(setRateInput)}
      />
      <CalculatorInputField
        label={t("money_guru_debt_payoff_payment_label")}
        type="currency"
        value={paymentInput}
        hasError={hasMissingFields || paymentTooLow}
        errorMessage={
          paymentTooLow
            ? t("money_guru_debt_payoff_too_low_error")
            : t("money_guru_debt_payoff_error")
        }
        onChange={handleInputChange(setPaymentInput)}
      />

      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={handleCalculate}
      >
        {t("money_guru_calculator_calculate_cta")}
      </button>

      {result && result.monthsToPayOff !== null && result.totalInterest !== null && (
        <CalculatorResultCard
          summary={t("money_guru_debt_payoff_summary")}
          lineItems={[
            {
              label: t("money_guru_debt_payoff_time_to_clear"),
              value: `${Math.ceil(result.monthsToPayOff)} ${t(
                "money_guru_loan_prepayment_months_suffix"
              )}`,
              emphasis: true,
            },
            {
              label: t("money_guru_debt_payoff_total_interest"),
              value: formatToInr(result.totalInterest),
            },
          ]}
          nextStepLabel={t("money_guru_debt_payoff_next_step")}
          onNextStepClick={handleNextStepClick}
        />
      )}
    </PageLayout>
  );
}
