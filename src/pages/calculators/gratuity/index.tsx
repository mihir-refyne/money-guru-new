import CalculatorInputField from "@/components/CalculatorInputField";
import CalculatorResultCard from "@/components/CalculatorResultCard";
import PageLayout from "@/components/PageLayout";
import useTranslation from "@/hooks/useTranslation";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import calculatorsConfig from "@/lib/calculators/config";
import { calculateGratuity } from "@/lib/calculators/gratuity";
import { formatToInr } from "@/lib/utils";
import { useRouter } from "next/router";
import { useState } from "react";

const NEXT_STEP_PATH = "/calculators/retirement-corpus";

export default function GratuityCalculatorPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [salaryInput, setSalaryInput] = useState("");
  const [yearsInput, setYearsInput] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const lastDrawnMonthlySalary = Number(salaryInput) || 0;
  const yearsOfService = Number(yearsInput) || 0;
  const hasError = hasSubmitted && (lastDrawnMonthlySalary <= 0 || yearsOfService <= 0);

  const result =
    hasSubmitted && !hasError
      ? calculateGratuity(
          lastDrawnMonthlySalary,
          yearsOfService,
          calculatorsConfig.gratuity.minYearsOfServiceForEligibility,
          calculatorsConfig.gratuity.numeratorDays,
          calculatorsConfig.gratuity.divisor
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
    if (lastDrawnMonthlySalary <= 0 || yearsOfService <= 0) return;
    logMoneyGuruEvent(AnalyticEvent.CALCULATOR_RUN, { type: "gratuity" });
  }

  function handleNextStepClick() {
    logMoneyGuruEvent(AnalyticEvent.NEXT_STEP_CLICKED, {
      destination: NEXT_STEP_PATH,
    });
    router.push(NEXT_STEP_PATH);
  }

  return (
    <PageLayout navbarText={t("money_guru_gratuity_calculator_title")}>
      <CalculatorInputField
        label={t("money_guru_gratuity_salary_label")}
        type="currency"
        value={salaryInput}
        hasError={hasError}
        onChange={handleInputChange(setSalaryInput)}
      />
      <CalculatorInputField
        label={t("money_guru_gratuity_years_label")}
        type="number"
        value={yearsInput}
        hasError={hasError}
        errorMessage={t("money_guru_gratuity_error")}
        onChange={handleInputChange(setYearsInput)}
      />

      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={handleCalculate}
      >
        {t("money_guru_calculator_calculate_cta")}
      </button>

      {result && !result.isEligible && (
        <CalculatorResultCard
          summary={t("money_guru_gratuity_not_eligible")}
          lineItems={[]}
        />
      )}

      {result && result.isEligible && (
        <CalculatorResultCard
          summary={t("money_guru_gratuity_summary")}
          lineItems={[
            {
              label: t("money_guru_gratuity_amount"),
              value: formatToInr(result.gratuityAmount),
              emphasis: true,
            },
          ]}
          nextStepLabel={t("money_guru_gratuity_next_step")}
          onNextStepClick={handleNextStepClick}
        />
      )}
    </PageLayout>
  );
}
