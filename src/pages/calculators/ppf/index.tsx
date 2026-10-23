import CalculatorInputField from "@/components/CalculatorInputField";
import CalculatorResultCard from "@/components/CalculatorResultCard";
import PageLayout from "@/components/PageLayout";
import useTranslation from "@/hooks/useTranslation";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import calculatorsConfig from "@/lib/calculators/config";
import { calculatePpfMaturity } from "@/lib/calculators/ppf";
import { formatToInr } from "@/lib/utils";
import { useRouter } from "next/router";
import { useState } from "react";

const NEXT_STEP_PATH = "/calculators/nps";

export default function PpfCalculatorPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [contributionInput, setContributionInput] = useState("");
  const [tenureInput, setTenureInput] = useState(
    calculatorsConfig.ppf.defaultTenureYears.toString()
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const yearlyContribution = Number(contributionInput) || 0;
  const tenureYears = Number(tenureInput) || 0;
  const hasError = hasSubmitted && (yearlyContribution <= 0 || tenureYears <= 0);

  const result =
    hasSubmitted && !hasError
      ? calculatePpfMaturity(
          yearlyContribution,
          calculatorsConfig.ppf.ratePercent,
          tenureYears
        )
      : null;

  function handleInputChange(setter: (value: string) => void) {
    return (value: string) => {
      setter(value);
      setHasSubmitted(false);
    };
  }

  function handleCalculate() {
    setHasSubmitted(true);
    if (yearlyContribution <= 0 || tenureYears <= 0) return;
    logMoneyGuruEvent(AnalyticEvent.CALCULATOR_RUN, { type: "ppf" });
  }

  function handleNextStepClick() {
    logMoneyGuruEvent(AnalyticEvent.NEXT_STEP_CLICKED, {
      destination: NEXT_STEP_PATH,
    });
    router.push(NEXT_STEP_PATH);
  }

  return (
    <PageLayout navbarText={t("money_guru_ppf_calculator_title")}>
      <CalculatorInputField
        label={t("money_guru_ppf_contribution_label")}
        type="currency"
        value={contributionInput}
        hasError={hasError}
        errorMessage={t("money_guru_ppf_error")}
        onChange={handleInputChange(setContributionInput)}
      />
      <CalculatorInputField
        label={t("money_guru_ppf_tenure_label")}
        type="number"
        value={tenureInput}
        hasError={hasError}
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
          summary={t("money_guru_ppf_summary")}
          lineItems={[
            {
              label: t("money_guru_ppf_invested"),
              value: formatToInr(yearlyContribution * tenureYears),
            },
            {
              label: t("money_guru_ppf_maturity_value"),
              value: formatToInr(result.maturityValue),
              emphasis: true,
            },
          ]}
          nextStepLabel={t("money_guru_ppf_next_step")}
          onNextStepClick={handleNextStepClick}
        />
      )}
    </PageLayout>
  );
}
