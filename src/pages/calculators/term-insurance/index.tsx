import CalculatorInputField from "@/components/CalculatorInputField";
import CalculatorResultCard from "@/components/CalculatorResultCard";
import PageLayout from "@/components/PageLayout";
import useTranslation from "@/hooks/useTranslation";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import calculatorsConfig from "@/lib/calculators/config";
import { calculateSuggestedTermCover } from "@/lib/calculators/termInsurance";
import { formatToInr } from "@/lib/utils";
import { useRouter } from "next/router";
import { useState } from "react";

const NEXT_STEP_PATH = "/calculators/retirement-corpus";

export default function TermInsuranceCalculatorPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [incomeInput, setIncomeInput] = useState("");
  const [dependentsInput, setDependentsInput] = useState("");
  const [liabilitiesInput, setLiabilitiesInput] = useState("");
  const [savingsInput, setSavingsInput] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const annualIncome = Number(incomeInput) || 0;
  const numberOfDependents = Number(dependentsInput) || 0;
  const outstandingLiabilities = Number(liabilitiesInput) || 0;
  const existingSavingsAndCover = Number(savingsInput) || 0;
  const hasError = hasSubmitted && annualIncome <= 0;

  const suggestedCover =
    hasSubmitted && !hasError
      ? calculateSuggestedTermCover(
          {
            annualIncome,
            numberOfDependents,
            outstandingLiabilities,
            existingSavingsAndCover,
          },
          calculatorsConfig.termInsurance.baseIncomeMultiplier,
          calculatorsConfig.termInsurance.perDependentMultiplier
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
    if (annualIncome <= 0) return;
    logMoneyGuruEvent(AnalyticEvent.CALCULATOR_RUN, { type: "term_insurance" });
  }

  function handleNextStepClick() {
    logMoneyGuruEvent(AnalyticEvent.NEXT_STEP_CLICKED, {
      destination: NEXT_STEP_PATH,
    });
    router.push(NEXT_STEP_PATH);
  }

  return (
    <PageLayout navbarText={t("money_guru_term_insurance_calculator_title")}>
      <CalculatorInputField
        label={t("money_guru_term_insurance_income_label")}
        type="currency"
        value={incomeInput}
        hasError={hasError}
        errorMessage={t("money_guru_term_insurance_error")}
        onChange={handleInputChange(setIncomeInput)}
      />
      <CalculatorInputField
        label={t("money_guru_term_insurance_dependents_label")}
        type="number"
        value={dependentsInput}
        onChange={handleInputChange(setDependentsInput)}
      />
      <CalculatorInputField
        label={t("money_guru_term_insurance_liabilities_label")}
        type="currency"
        value={liabilitiesInput}
        onChange={handleInputChange(setLiabilitiesInput)}
      />
      <CalculatorInputField
        label={t("money_guru_term_insurance_savings_label")}
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

      {suggestedCover !== null && (
        <CalculatorResultCard
          summary={t("money_guru_term_insurance_summary")}
          lineItems={[
            {
              label: t("money_guru_term_insurance_cover"),
              value: formatToInr(suggestedCover),
              emphasis: true,
            },
          ]}
          nextStepLabel={t("money_guru_term_insurance_next_step")}
          onNextStepClick={handleNextStepClick}
        />
      )}
    </PageLayout>
  );
}
