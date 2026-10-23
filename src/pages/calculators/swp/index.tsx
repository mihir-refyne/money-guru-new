import CalculatorInputField from "@/components/CalculatorInputField";
import CalculatorResultCard from "@/components/CalculatorResultCard";
import PageLayout from "@/components/PageLayout";
import useTranslation from "@/hooks/useTranslation";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import { calculateSwp } from "@/lib/calculators/swp";
import { formatToInr } from "@/lib/utils";
import { useRouter } from "next/router";
import { useState } from "react";

const NEXT_STEP_PATH = "/calculators/retirement-corpus";

export default function SwpCalculatorPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [corpusInput, setCorpusInput] = useState("");
  const [rateInput, setRateInput] = useState("");
  const [withdrawalInput, setWithdrawalInput] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const corpus = Number(corpusInput) || 0;
  const annualRatePercent = Number(rateInput) || 0;
  const monthlyWithdrawal = Number(withdrawalInput) || 0;
  const hasError =
    hasSubmitted && (corpus <= 0 || annualRatePercent <= 0 || monthlyWithdrawal <= 0);

  const result =
    hasSubmitted && !hasError
      ? calculateSwp(corpus, annualRatePercent, monthlyWithdrawal)
      : null;

  function handleInputChange(setter: (value: string) => void) {
    return (value: string) => {
      setter(value);
      setHasSubmitted(false);
    };
  }

  function handleCalculate() {
    setHasSubmitted(true);
    if (corpus <= 0 || annualRatePercent <= 0 || monthlyWithdrawal <= 0) return;
    logMoneyGuruEvent(AnalyticEvent.CALCULATOR_RUN, { type: "swp" });
  }

  function handleNextStepClick() {
    logMoneyGuruEvent(AnalyticEvent.NEXT_STEP_CLICKED, {
      destination: NEXT_STEP_PATH,
    });
    router.push(NEXT_STEP_PATH);
  }

  return (
    <PageLayout navbarText={t("money_guru_swp_calculator_title")}>
      <CalculatorInputField
        label={t("money_guru_swp_corpus_label")}
        type="currency"
        value={corpusInput}
        hasError={hasError}
        onChange={handleInputChange(setCorpusInput)}
      />
      <CalculatorInputField
        label={t("money_guru_swp_rate_label")}
        type="number"
        value={rateInput}
        hasError={hasError}
        onChange={handleInputChange(setRateInput)}
      />
      <CalculatorInputField
        label={t("money_guru_swp_withdrawal_label")}
        type="currency"
        value={withdrawalInput}
        hasError={hasError}
        errorMessage={t("money_guru_swp_error")}
        onChange={handleInputChange(setWithdrawalInput)}
      />

      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={handleCalculate}
      >
        {t("money_guru_calculator_calculate_cta")}
      </button>

      {result && result.monthsUntilDepleted === null && (
        <CalculatorResultCard
          summary={t("money_guru_swp_never_depletes")}
          lineItems={[]}
        />
      )}

      {result &&
        result.monthsUntilDepleted !== null &&
        result.totalWithdrawn !== null && (
          <CalculatorResultCard
            summary={t("money_guru_swp_summary")}
            lineItems={[
              {
                label: t("money_guru_swp_months"),
                value: `${Math.round(result.monthsUntilDepleted)}`,
                emphasis: true,
              },
              {
                label: t("money_guru_swp_total_withdrawn"),
                value: formatToInr(result.totalWithdrawn),
              },
            ]}
            nextStepLabel={t("money_guru_swp_next_step")}
            onNextStepClick={handleNextStepClick}
          />
        )}
    </PageLayout>
  );
}
