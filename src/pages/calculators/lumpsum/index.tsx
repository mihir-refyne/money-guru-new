import CalculatorInputField from "@/components/CalculatorInputField";
import CalculatorResultCard from "@/components/CalculatorResultCard";
import PageLayout from "@/components/PageLayout";
import useTranslation from "@/hooks/useTranslation";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import { calculateLumpsumFutureValue } from "@/lib/calculators/lumpsum";
import { formatToInr } from "@/lib/utils";
import { useRouter } from "next/router";
import { useState } from "react";

const NEXT_STEP_PATH = "/calculators/sip-goal-planner";

export default function LumpsumCalculatorPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [amountInput, setAmountInput] = useState("");
  const [rateInput, setRateInput] = useState("");
  const [tenureInput, setTenureInput] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const amount = Number(amountInput) || 0;
  const annualRatePercent = Number(rateInput) || 0;
  const tenureYears = Number(tenureInput) || 0;
  const hasError =
    hasSubmitted && (amount <= 0 || annualRatePercent <= 0 || tenureYears <= 0);

  const futureValue =
    hasSubmitted && !hasError
      ? calculateLumpsumFutureValue(amount, annualRatePercent, tenureYears)
      : null;

  function handleInputChange(setter: (value: string) => void) {
    return (value: string) => {
      setter(value);
      setHasSubmitted(false);
    };
  }

  function handleCalculate() {
    setHasSubmitted(true);
    if (amount <= 0 || annualRatePercent <= 0 || tenureYears <= 0) return;
    logMoneyGuruEvent(AnalyticEvent.CALCULATOR_RUN, { type: "lumpsum" });
  }

  function handleNextStepClick() {
    logMoneyGuruEvent(AnalyticEvent.NEXT_STEP_CLICKED, {
      destination: NEXT_STEP_PATH,
    });
    router.push(NEXT_STEP_PATH);
  }

  return (
    <PageLayout navbarText={t("money_guru_lumpsum_calculator_title")}>
      <CalculatorInputField
        label={t("money_guru_lumpsum_amount_label")}
        type="currency"
        value={amountInput}
        hasError={hasError}
        onChange={handleInputChange(setAmountInput)}
      />
      <CalculatorInputField
        label={t("money_guru_lumpsum_rate_label")}
        type="number"
        value={rateInput}
        hasError={hasError}
        onChange={handleInputChange(setRateInput)}
      />
      <CalculatorInputField
        label={t("money_guru_lumpsum_tenure_label")}
        type="number"
        value={tenureInput}
        hasError={hasError}
        errorMessage={t("money_guru_lumpsum_error")}
        onChange={handleInputChange(setTenureInput)}
      />

      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={handleCalculate}
      >
        {t("money_guru_calculator_calculate_cta")}
      </button>

      {futureValue !== null && (
        <CalculatorResultCard
          summary={t("money_guru_lumpsum_summary")}
          lineItems={[
            {
              label: t("money_guru_lumpsum_invested"),
              value: formatToInr(amount),
            },
            {
              label: t("money_guru_lumpsum_gain"),
              value: formatToInr(futureValue - amount),
            },
            {
              label: t("money_guru_lumpsum_future_value"),
              value: formatToInr(futureValue),
              emphasis: true,
            },
          ]}
          nextStepLabel={t("money_guru_lumpsum_next_step")}
          onNextStepClick={handleNextStepClick}
        />
      )}
    </PageLayout>
  );
}
