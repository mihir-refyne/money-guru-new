import CalculatorInputField from "@/components/CalculatorInputField";
import CalculatorResultCard from "@/components/CalculatorResultCard";
import PageLayout from "@/components/PageLayout";
import useTranslation from "@/hooks/useTranslation";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import calculatorsConfig from "@/lib/calculators/config";
import { calculateNpsProjection } from "@/lib/calculators/nps";
import { formatToInr } from "@/lib/utils";
import { useRouter } from "next/router";
import { useState } from "react";

const NEXT_STEP_PATH = "/calculators/retirement-corpus";

export default function NpsCalculatorPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [contributionInput, setContributionInput] = useState("");
  const [ageInput, setAgeInput] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const monthlyContribution = Number(contributionInput) || 0;
  const currentAge = Number(ageInput) || 0;
  const hasError =
    hasSubmitted &&
    (monthlyContribution <= 0 ||
      currentAge <= 0 ||
      currentAge >= calculatorsConfig.nps.retirementAge);

  const result =
    hasSubmitted && !hasError
      ? calculateNpsProjection({
          monthlyContribution,
          currentAge,
          annualRatePercent: calculatorsConfig.nps.assumedAnnualReturnPercent,
          minAnnuityPercent: calculatorsConfig.nps.minAnnuityPercent,
          assumedAnnuityRatePercent:
            calculatorsConfig.nps.assumedAnnuityRatePercent,
          retirementAge: calculatorsConfig.nps.retirementAge,
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
      monthlyContribution <= 0 ||
      currentAge <= 0 ||
      currentAge >= calculatorsConfig.nps.retirementAge
    )
      return;
    logMoneyGuruEvent(AnalyticEvent.CALCULATOR_RUN, { type: "nps" });
  }

  function handleNextStepClick() {
    logMoneyGuruEvent(AnalyticEvent.NEXT_STEP_CLICKED, {
      destination: NEXT_STEP_PATH,
    });
    router.push(NEXT_STEP_PATH);
  }

  return (
    <PageLayout navbarText={t("money_guru_nps_calculator_title")}>
      <CalculatorInputField
        label={t("money_guru_nps_contribution_label")}
        type="currency"
        value={contributionInput}
        hasError={hasError}
        onChange={handleInputChange(setContributionInput)}
      />
      <CalculatorInputField
        label={t("money_guru_nps_age_label")}
        type="number"
        value={ageInput}
        hasError={hasError}
        errorMessage={t("money_guru_nps_error")}
        onChange={handleInputChange(setAgeInput)}
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
          summary={t("money_guru_nps_summary")}
          lineItems={[
            {
              label: t("money_guru_nps_corpus"),
              value: formatToInr(result.projectedCorpus),
              emphasis: true,
            },
            {
              label: t("money_guru_nps_lumpsum"),
              value: formatToInr(result.lumpSumWithdrawal),
            },
            {
              label: t("money_guru_nps_annuitized"),
              value: formatToInr(result.annuitizedAmount),
            },
            {
              label: t("money_guru_nps_pension"),
              value: formatToInr(result.estimatedMonthlyPension),
            },
          ]}
          nextStepLabel={t("money_guru_nps_next_step")}
          onNextStepClick={handleNextStepClick}
        />
      )}
    </PageLayout>
  );
}
