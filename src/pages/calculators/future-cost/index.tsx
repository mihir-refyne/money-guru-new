import CalculatorInputField from "@/components/CalculatorInputField";
import CalculatorResultCard from "@/components/CalculatorResultCard";
import PageLayout from "@/components/PageLayout";
import useTranslation from "@/hooks/useTranslation";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import calculatorsConfig from "@/lib/calculators/config";
import { calculateFutureCost } from "@/lib/calculators/inflation";
import { formatToInr } from "@/lib/utils";
import { useRouter } from "next/router";
import { useState } from "react";

const NEXT_STEP_PATH = "/calculators/sip-goal-planner";

export default function FutureCostCalculatorPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [amountInput, setAmountInput] = useState("");
  const [rateInput, setRateInput] = useState(
    calculatorsConfig.inflation.defaultRatePercent.toString()
  );
  const [yearsInput, setYearsInput] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const currentCost = Number(amountInput) || 0;
  const inflationRatePercent = Number(rateInput) || 0;
  const years = Number(yearsInput) || 0;
  const hasError =
    hasSubmitted && (currentCost <= 0 || inflationRatePercent <= 0 || years <= 0);

  const futureCost =
    hasSubmitted && !hasError
      ? calculateFutureCost(currentCost, inflationRatePercent, years)
      : null;

  function handleInputChange(setter: (value: string) => void) {
    return (value: string) => {
      setter(value);
      setHasSubmitted(false);
    };
  }

  function handleCalculate() {
    setHasSubmitted(true);
    if (currentCost <= 0 || inflationRatePercent <= 0 || years <= 0) return;
    logMoneyGuruEvent(AnalyticEvent.CALCULATOR_RUN, { type: "future_cost" });
  }

  function handleNextStepClick() {
    logMoneyGuruEvent(AnalyticEvent.NEXT_STEP_CLICKED, {
      destination: NEXT_STEP_PATH,
    });
    router.push(NEXT_STEP_PATH);
  }

  return (
    <PageLayout navbarText={t("money_guru_future_cost_calculator_title")}>
      <CalculatorInputField
        label={t("money_guru_future_cost_amount_label")}
        type="currency"
        value={amountInput}
        hasError={hasError}
        onChange={handleInputChange(setAmountInput)}
      />
      <CalculatorInputField
        label={t("money_guru_future_cost_rate_label")}
        type="number"
        value={rateInput}
        hasError={hasError}
        onChange={handleInputChange(setRateInput)}
      />
      <CalculatorInputField
        label={t("money_guru_future_cost_years_label")}
        type="number"
        value={yearsInput}
        hasError={hasError}
        errorMessage={t("money_guru_future_cost_error")}
        onChange={handleInputChange(setYearsInput)}
      />

      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={handleCalculate}
      >
        {t("money_guru_calculator_calculate_cta")}
      </button>

      {futureCost !== null && (
        <CalculatorResultCard
          summary={t("money_guru_future_cost_summary")}
          lineItems={[
            {
              label: t("money_guru_future_cost_today"),
              value: formatToInr(currentCost),
            },
            {
              label: t("money_guru_future_cost_future"),
              value: formatToInr(futureCost),
              emphasis: true,
            },
          ]}
          nextStepLabel={t("money_guru_future_cost_next_step")}
          onNextStepClick={handleNextStepClick}
        />
      )}
    </PageLayout>
  );
}
