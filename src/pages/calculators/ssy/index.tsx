import CalculatorInputField from "@/components/CalculatorInputField";
import CalculatorResultCard from "@/components/CalculatorResultCard";
import PageLayout from "@/components/PageLayout";
import useTranslation from "@/hooks/useTranslation";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import calculatorsConfig from "@/lib/calculators/config";
import { calculateSsyMaturity } from "@/lib/calculators/ssy";
import { formatToInr } from "@/lib/utils";
import { useRouter } from "next/router";
import { useState } from "react";

const NEXT_STEP_PATH = "/calculators/ppf";

export default function SsyCalculatorPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [contributionInput, setContributionInput] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const yearlyDeposit = Number(contributionInput) || 0;
  const hasError = hasSubmitted && yearlyDeposit <= 0;

  const result =
    hasSubmitted && !hasError
      ? calculateSsyMaturity(
          yearlyDeposit,
          calculatorsConfig.ssy.ratePercent,
          calculatorsConfig.ssy.depositYears,
          calculatorsConfig.ssy.maturityYears
        )
      : null;

  function handleCalculate() {
    setHasSubmitted(true);
    if (yearlyDeposit <= 0) return;
    logMoneyGuruEvent(AnalyticEvent.CALCULATOR_RUN, { type: "ssy" });
  }

  function handleNextStepClick() {
    logMoneyGuruEvent(AnalyticEvent.NEXT_STEP_CLICKED, {
      destination: NEXT_STEP_PATH,
    });
    router.push(NEXT_STEP_PATH);
  }

  return (
    <PageLayout navbarText={t("money_guru_ssy_calculator_title")}>
      <CalculatorInputField
        label={t("money_guru_ssy_contribution_label")}
        type="currency"
        value={contributionInput}
        hasError={hasError}
        errorMessage={t("money_guru_ssy_error")}
        onChange={(value) => {
          setContributionInput(value);
          setHasSubmitted(false);
        }}
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
          summary={t("money_guru_ssy_summary")}
          lineItems={[
            {
              label: t("money_guru_ssy_invested"),
              value: formatToInr(
                yearlyDeposit * calculatorsConfig.ssy.depositYears
              ),
            },
            {
              label: t("money_guru_ssy_maturity_value"),
              value: formatToInr(result.maturityValue),
              emphasis: true,
            },
          ]}
          nextStepLabel={t("money_guru_ssy_next_step")}
          onNextStepClick={handleNextStepClick}
        />
      )}
    </PageLayout>
  );
}
