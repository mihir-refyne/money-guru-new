import CalculatorInputField from "@/components/CalculatorInputField";
import CalculatorResultCard from "@/components/CalculatorResultCard";
import PageLayout from "@/components/PageLayout";
import SegmentedControl from "@/components/SegmentedControl";
import useTranslation from "@/hooks/useTranslation";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import {
  calculateRequiredMonthlySip,
  calculateSipFutureValue,
  calculateStepUpSipFutureValue,
} from "@/lib/calculators/sip";
import { formatToInr } from "@/lib/utils";
import { useRouter } from "next/router";
import { useState } from "react";

const NEXT_STEP_PATH = "/calculators/lumpsum";
type Mode = "returns" | "goal";

export default function SipGoalPlannerCalculatorPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("returns");
  const [monthlyInvestmentInput, setMonthlyInvestmentInput] = useState("");
  const [targetAmountInput, setTargetAmountInput] = useState("");
  const [rateInput, setRateInput] = useState("");
  const [stepUpInput, setStepUpInput] = useState("");
  const [tenureYearsInput, setTenureYearsInput] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const monthlyInvestment = Number(monthlyInvestmentInput) || 0;
  const targetAmount = Number(targetAmountInput) || 0;
  const annualRatePercent = Number(rateInput) || 0;
  const stepUpPercent = Number(stepUpInput) || 0;
  const tenureMonths = (Number(tenureYearsInput) || 0) * 12;

  const hasError =
    hasSubmitted &&
    (annualRatePercent <= 0 ||
      tenureMonths <= 0 ||
      (mode === "returns" ? monthlyInvestment <= 0 : targetAmount <= 0));

  const returnsResult =
    hasSubmitted && !hasError && mode === "returns"
      ? {
          futureValue: stepUpPercent
            ? calculateStepUpSipFutureValue(
                monthlyInvestment,
                annualRatePercent,
                stepUpPercent,
                tenureMonths
              )
            : calculateSipFutureValue(
                monthlyInvestment,
                annualRatePercent,
                tenureMonths
              ),
          invested: monthlyInvestment * tenureMonths,
        }
      : null;

  const goalResult =
    hasSubmitted && !hasError && mode === "goal"
      ? calculateRequiredMonthlySip(targetAmount, annualRatePercent, tenureMonths)
      : null;

  function handleModeChange(newMode: Mode) {
    setMode(newMode);
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
    if (
      annualRatePercent <= 0 ||
      tenureMonths <= 0 ||
      (mode === "returns" ? monthlyInvestment <= 0 : targetAmount <= 0)
    )
      return;
    logMoneyGuruEvent(AnalyticEvent.CALCULATOR_RUN, {
      type: "sip_goal_planner",
      mode,
    });
  }

  function handleNextStepClick() {
    logMoneyGuruEvent(AnalyticEvent.NEXT_STEP_CLICKED, {
      destination: NEXT_STEP_PATH,
    });
    router.push(NEXT_STEP_PATH);
  }

  return (
    <PageLayout navbarText={t("money_guru_sip_calculator_title")}>
      <div className="mb-4">
        <SegmentedControl<Mode>
          value={mode}
          onChange={handleModeChange}
          options={[
            { value: "returns", label: t("money_guru_sip_mode_returns_label") },
            { value: "goal", label: t("money_guru_sip_mode_goal_label") },
          ]}
        />
      </div>

      {mode === "returns" ? (
        <CalculatorInputField
          label={t("money_guru_sip_monthly_investment_label")}
          type="currency"
          value={monthlyInvestmentInput}
          hasError={hasError}
          onChange={handleInputChange(setMonthlyInvestmentInput)}
        />
      ) : (
        <CalculatorInputField
          label={t("money_guru_sip_target_amount_label")}
          type="currency"
          value={targetAmountInput}
          hasError={hasError}
          onChange={handleInputChange(setTargetAmountInput)}
        />
      )}
      <CalculatorInputField
        label={t("money_guru_sip_rate_label")}
        type="number"
        value={rateInput}
        hasError={hasError}
        onChange={handleInputChange(setRateInput)}
      />
      {mode === "returns" && (
        <CalculatorInputField
          label={t("money_guru_sip_stepup_label")}
          type="number"
          value={stepUpInput}
          onChange={handleInputChange(setStepUpInput)}
        />
      )}
      <CalculatorInputField
        label={t("money_guru_sip_tenure_label")}
        type="number"
        value={tenureYearsInput}
        hasError={hasError}
        errorMessage={t("money_guru_sip_error")}
        onChange={handleInputChange(setTenureYearsInput)}
      />

      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={handleCalculate}
      >
        {t("money_guru_calculator_calculate_cta")}
      </button>

      {returnsResult && (
        <CalculatorResultCard
          summary={t("money_guru_sip_summary_returns")}
          lineItems={[
            {
              label: t("money_guru_sip_invested"),
              value: formatToInr(returnsResult.invested),
            },
            {
              label: t("money_guru_sip_future_value"),
              value: formatToInr(returnsResult.futureValue),
              emphasis: true,
            },
          ]}
          nextStepLabel={t("money_guru_sip_next_step")}
          onNextStepClick={handleNextStepClick}
        />
      )}

      {goalResult !== null && (
        <CalculatorResultCard
          summary={t("money_guru_sip_summary_goal")}
          lineItems={[
            {
              label: t("money_guru_sip_required_monthly"),
              value: formatToInr(goalResult),
              emphasis: true,
            },
          ]}
          nextStepLabel={t("money_guru_sip_next_step")}
          onNextStepClick={handleNextStepClick}
        />
      )}
    </PageLayout>
  );
}
