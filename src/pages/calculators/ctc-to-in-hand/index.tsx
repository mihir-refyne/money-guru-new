import CalculatorInputField from "@/components/CalculatorInputField";
import CalculatorResultCard from "@/components/CalculatorResultCard";
import PageLayout from "@/components/PageLayout";
import useTranslation from "@/hooks/useTranslation";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import { calculateCtcToInHand } from "@/lib/calculators/ctcToInHand";
import { formatToInr } from "@/lib/utils";
import { useRouter } from "next/router";
import { useState } from "react";

const NEXT_STEP_PATH = "/calculators/hra-exemption";

export default function CtcToInHandCalculatorPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [ctcInput, setCtcInput] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const annualCtc = Number(ctcInput) || 0;
  const hasError = hasSubmitted && annualCtc <= 0;
  const result = hasSubmitted && annualCtc > 0 ? calculateCtcToInHand({ annualCtc }) : null;

  function handleCalculate() {
    setHasSubmitted(true);
    if (annualCtc <= 0) return;
    logMoneyGuruEvent(AnalyticEvent.CALCULATOR_RUN, {
      type: "ctc_to_in_hand",
    });
  }

  function handleNextStepClick() {
    logMoneyGuruEvent(AnalyticEvent.NEXT_STEP_CLICKED, {
      destination: NEXT_STEP_PATH,
    });
    router.push(NEXT_STEP_PATH);
  }

  return (
    <PageLayout navbarText={t("money_guru_ctc_calculator_title")}>
      <CalculatorInputField
        label={t("money_guru_ctc_calculator_ctc_label")}
        type="currency"
        value={ctcInput}
        placeholder={t("money_guru_ctc_calculator_ctc_placeholder")}
        hasError={hasError}
        errorMessage={t("money_guru_ctc_calculator_ctc_error")}
        onChange={(value) => {
          setCtcInput(value);
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
          summary={t("money_guru_ctc_calculator_summary")}
          lineItems={[
            {
              label: t("money_guru_ctc_calculator_basic"),
              value: formatToInr(result.monthlyBasicSalary),
            },
            {
              label: t("money_guru_ctc_calculator_employer_pf"),
              value: formatToInr(result.monthlyEmployerPf),
            },
            {
              label: t("money_guru_ctc_calculator_employee_pf"),
              value: `- ${formatToInr(result.monthlyEmployeePf)}`,
            },
            {
              label: t("money_guru_ctc_calculator_professional_tax"),
              value: `- ${formatToInr(result.monthlyProfessionalTax)}`,
            },
            {
              label: t("money_guru_ctc_calculator_income_tax"),
              value: `- ${formatToInr(result.monthlyIncomeTax)}`,
            },
            {
              label: t("money_guru_ctc_calculator_monthly_inhand"),
              value: formatToInr(result.monthlyInHandSalary),
              emphasis: true,
            },
            {
              label: t("money_guru_ctc_calculator_annual_inhand"),
              value: formatToInr(result.annualInHandSalary),
            },
          ]}
          nextStepLabel={t("money_guru_ctc_calculator_next_step")}
          onNextStepClick={handleNextStepClick}
        />
      )}
    </PageLayout>
  );
}
