import CalculatorInputField from "@/components/CalculatorInputField";
import CalculatorResultCard from "@/components/CalculatorResultCard";
import PageLayout from "@/components/PageLayout";
import useTranslation from "@/hooks/useTranslation";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import { compareFlatVsReducingRate } from "@/lib/calculators/flatVsReducing";
import { formatToInr } from "@/lib/utils";
import { useRouter } from "next/router";
import { useState } from "react";

const NEXT_STEP_PATH = "/calculators/loan-emi";

export default function FlatVsReducingRateCalculatorPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [principalInput, setPrincipalInput] = useState("");
  const [tenureInput, setTenureInput] = useState("");
  const [flatRateInput, setFlatRateInput] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const principal = Number(principalInput) || 0;
  const tenureMonths = Number(tenureInput) || 0;
  const flatRatePercent = Number(flatRateInput) || 0;
  const hasError =
    hasSubmitted && (principal <= 0 || tenureMonths <= 0 || flatRatePercent <= 0);

  const result =
    hasSubmitted && !hasError
      ? compareFlatVsReducingRate(principal, tenureMonths, flatRatePercent)
      : null;

  function handleInputChange(setter: (value: string) => void) {
    return (value: string) => {
      setter(value);
      setHasSubmitted(false);
    };
  }

  function handleCalculate() {
    setHasSubmitted(true);
    if (principal <= 0 || tenureMonths <= 0 || flatRatePercent <= 0) return;
    logMoneyGuruEvent(AnalyticEvent.CALCULATOR_RUN, {
      type: "flat_vs_reducing_rate",
    });
  }

  function handleNextStepClick() {
    logMoneyGuruEvent(AnalyticEvent.NEXT_STEP_CLICKED, {
      destination: NEXT_STEP_PATH,
    });
    router.push(NEXT_STEP_PATH);
  }

  return (
    <PageLayout navbarText={t("money_guru_flat_vs_reducing_calculator_title")}>
      <CalculatorInputField
        label={t("money_guru_flat_vs_reducing_principal_label")}
        type="currency"
        value={principalInput}
        hasError={hasError}
        onChange={handleInputChange(setPrincipalInput)}
      />
      <CalculatorInputField
        label={t("money_guru_flat_vs_reducing_tenure_label")}
        type="number"
        value={tenureInput}
        hasError={hasError}
        onChange={handleInputChange(setTenureInput)}
      />
      <CalculatorInputField
        label={t("money_guru_flat_vs_reducing_flat_rate_label")}
        type="number"
        value={flatRateInput}
        hasError={hasError}
        errorMessage={t("money_guru_flat_vs_reducing_error")}
        onChange={handleInputChange(setFlatRateInput)}
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
          summary={t("money_guru_flat_vs_reducing_summary")}
          lineItems={[
            {
              label: t("money_guru_flat_vs_reducing_emi"),
              value: formatToInr(result.emiUnderFlatRate),
            },
            {
              label: t("money_guru_flat_vs_reducing_total_interest"),
              value: formatToInr(result.totalInterestUnderFlatRate),
            },
            {
              label: t("money_guru_flat_vs_reducing_equivalent_rate"),
              value: `${result.equivalentReducingRatePercent.toFixed(2)}%`,
              emphasis: true,
            },
          ]}
          nextStepLabel={t("money_guru_flat_vs_reducing_next_step")}
          onNextStepClick={handleNextStepClick}
        />
      )}
    </PageLayout>
  );
}
