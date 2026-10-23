import CalculatorInputField from "@/components/CalculatorInputField";
import CalculatorResultCard from "@/components/CalculatorResultCard";
import PageLayout from "@/components/PageLayout";
import useTranslation from "@/hooks/useTranslation";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import { calculateEmergencyFundGap } from "@/lib/calculators/emergencyFund";
import calculatorsConfig from "@/lib/calculators/config";
import { formatToInr } from "@/lib/utils";
import { useRouter } from "next/router";
import { useState } from "react";

const NEXT_STEP_PATH = "/calculators/sip-goal-planner";

export default function EmergencyFundCalculatorPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [expensesInput, setExpensesInput] = useState("");
  const [monthsInput, setMonthsInput] = useState(
    calculatorsConfig.emergencyFund.recommendedMonthsOfCoverage.toString()
  );
  const [savingsInput, setSavingsInput] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const monthlyExpenses = Number(expensesInput) || 0;
  const monthsOfCoverage = Number(monthsInput) || 0;
  const currentSavings = Number(savingsInput) || 0;
  const hasError =
    hasSubmitted && (monthlyExpenses <= 0 || monthsOfCoverage <= 0);

  const result =
    hasSubmitted && !hasError
      ? calculateEmergencyFundGap(monthlyExpenses, monthsOfCoverage, currentSavings)
      : null;

  function handleInputChange(setter: (value: string) => void) {
    return (value: string) => {
      setter(value);
      setHasSubmitted(false);
    };
  }

  function handleCalculate() {
    setHasSubmitted(true);
    if (monthlyExpenses <= 0 || monthsOfCoverage <= 0) return;
    logMoneyGuruEvent(AnalyticEvent.CALCULATOR_RUN, { type: "emergency_fund" });
  }

  function handleNextStepClick() {
    logMoneyGuruEvent(AnalyticEvent.NEXT_STEP_CLICKED, {
      destination: NEXT_STEP_PATH,
    });
    router.push(NEXT_STEP_PATH);
  }

  return (
    <PageLayout navbarText={t("money_guru_emergency_fund_calculator_title")}>
      <CalculatorInputField
        label={t("money_guru_emergency_fund_expenses_label")}
        type="currency"
        value={expensesInput}
        hasError={hasError}
        onChange={handleInputChange(setExpensesInput)}
      />
      <CalculatorInputField
        label={t("money_guru_emergency_fund_months_label")}
        type="number"
        value={monthsInput}
        hasError={hasError}
        errorMessage={t("money_guru_emergency_fund_error")}
        onChange={handleInputChange(setMonthsInput)}
      />
      <CalculatorInputField
        label={t("money_guru_emergency_fund_savings_label")}
        type="currency"
        value={savingsInput}
        onChange={handleInputChange(setSavingsInput)}
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
          summary={t("money_guru_emergency_fund_summary")}
          lineItems={[
            {
              label: t("money_guru_emergency_fund_target"),
              value: formatToInr(result.targetAmount),
            },
            {
              label: t("money_guru_emergency_fund_gap"),
              value: formatToInr(result.gap),
              emphasis: true,
            },
          ]}
          nextStepLabel={t("money_guru_emergency_fund_next_step")}
          onNextStepClick={handleNextStepClick}
        />
      )}
    </PageLayout>
  );
}
