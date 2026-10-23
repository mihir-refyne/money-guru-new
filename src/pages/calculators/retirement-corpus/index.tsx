import CalculatorInputField from "@/components/CalculatorInputField";
import CalculatorResultCard from "@/components/CalculatorResultCard";
import PageLayout from "@/components/PageLayout";
import useTranslation from "@/hooks/useTranslation";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import calculatorsConfig from "@/lib/calculators/config";
import { calculateRetirementCorpus } from "@/lib/calculators/retirementCorpus";
import { formatToInr } from "@/lib/utils";
import { useRouter } from "next/router";
import { useState } from "react";

const NEXT_STEP_PATH = "/calculators/ppf";

export default function RetirementCorpusCalculatorPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [ageInput, setAgeInput] = useState("");
  const [retirementAgeInput, setRetirementAgeInput] = useState("60");
  const [expensesInput, setExpensesInput] = useState("");
  const [inflationInput, setInflationInput] = useState(
    calculatorsConfig.inflation.defaultRatePercent.toString()
  );
  const [postYearsInput, setPostYearsInput] = useState(
    calculatorsConfig.retirementCorpus.defaultPostRetirementYears.toString()
  );
  const [savingsInput, setSavingsInput] = useState("");
  const [contributionInput, setContributionInput] = useState("");
  const [returnInput, setReturnInput] = useState(
    calculatorsConfig.retirementCorpus.defaultPreRetirementReturnPercent.toString()
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const currentAge = Number(ageInput) || 0;
  const retirementAge = Number(retirementAgeInput) || 0;
  const monthlyExpensesToday = Number(expensesInput) || 0;
  const inflationRatePercent = Number(inflationInput) || 0;
  const postRetirementYears = Number(postYearsInput) || 0;
  const currentRetirementSavings = Number(savingsInput) || 0;
  const monthlyRetirementContribution = Number(contributionInput) || 0;
  const preRetirementReturnPercent = Number(returnInput) || 0;

  const hasError =
    hasSubmitted &&
    (currentAge <= 0 ||
      retirementAge <= currentAge ||
      monthlyExpensesToday <= 0 ||
      inflationRatePercent <= 0 ||
      postRetirementYears <= 0 ||
      preRetirementReturnPercent <= 0);

  const result =
    hasSubmitted && !hasError
      ? calculateRetirementCorpus({
          currentAge,
          retirementAge,
          monthlyExpensesToday,
          inflationRatePercent,
          postRetirementYears,
          currentRetirementSavings,
          monthlyRetirementContribution,
          preRetirementReturnPercent,
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
      currentAge <= 0 ||
      retirementAge <= currentAge ||
      monthlyExpensesToday <= 0 ||
      inflationRatePercent <= 0 ||
      postRetirementYears <= 0 ||
      preRetirementReturnPercent <= 0
    )
      return;
    logMoneyGuruEvent(AnalyticEvent.CALCULATOR_RUN, {
      type: "retirement_corpus",
    });
  }

  function handleNextStepClick() {
    logMoneyGuruEvent(AnalyticEvent.NEXT_STEP_CLICKED, {
      destination: NEXT_STEP_PATH,
    });
    router.push(NEXT_STEP_PATH);
  }

  return (
    <PageLayout navbarText={t("money_guru_retirement_corpus_calculator_title")}>
      <CalculatorInputField
        label={t("money_guru_retirement_corpus_age_label")}
        type="number"
        value={ageInput}
        hasError={hasError}
        onChange={handleInputChange(setAgeInput)}
      />
      <CalculatorInputField
        label={t("money_guru_retirement_corpus_retirement_age_label")}
        type="number"
        value={retirementAgeInput}
        hasError={hasError}
        onChange={handleInputChange(setRetirementAgeInput)}
      />
      <CalculatorInputField
        label={t("money_guru_retirement_corpus_expenses_label")}
        type="currency"
        value={expensesInput}
        hasError={hasError}
        onChange={handleInputChange(setExpensesInput)}
      />
      <CalculatorInputField
        label={t("money_guru_retirement_corpus_inflation_label")}
        type="number"
        value={inflationInput}
        hasError={hasError}
        onChange={handleInputChange(setInflationInput)}
      />
      <CalculatorInputField
        label={t("money_guru_retirement_corpus_post_years_label")}
        type="number"
        value={postYearsInput}
        hasError={hasError}
        onChange={handleInputChange(setPostYearsInput)}
      />
      <CalculatorInputField
        label={t("money_guru_retirement_corpus_savings_label")}
        type="currency"
        value={savingsInput}
        onChange={handleInputChange(setSavingsInput)}
      />
      <CalculatorInputField
        label={t("money_guru_retirement_corpus_contribution_label")}
        type="currency"
        value={contributionInput}
        onChange={handleInputChange(setContributionInput)}
      />
      <CalculatorInputField
        label={t("money_guru_retirement_corpus_return_label")}
        type="number"
        value={returnInput}
        hasError={hasError}
        errorMessage={t("money_guru_retirement_corpus_error")}
        onChange={handleInputChange(setReturnInput)}
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
          summary={t("money_guru_retirement_corpus_summary")}
          lineItems={[
            {
              label: t("money_guru_retirement_corpus_required"),
              value: formatToInr(result.requiredCorpus),
            },
            {
              label: t("money_guru_retirement_corpus_projected"),
              value: formatToInr(result.projectedCorpus),
            },
            {
              label: t("money_guru_retirement_corpus_gap"),
              value: formatToInr(result.gap),
              emphasis: true,
            },
          ]}
          nextStepLabel={t("money_guru_retirement_corpus_next_step")}
          onNextStepClick={handleNextStepClick}
        />
      )}
    </PageLayout>
  );
}
