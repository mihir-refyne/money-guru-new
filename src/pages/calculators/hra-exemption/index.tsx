import CalculatorInputField from "@/components/CalculatorInputField";
import CalculatorResultCard from "@/components/CalculatorResultCard";
import PageLayout from "@/components/PageLayout";
import useTranslation from "@/hooks/useTranslation";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import { calculateHraExemption } from "@/lib/calculators/hra";
import { formatToInr } from "@/lib/utils";
import { useRouter } from "next/router";
import { useState } from "react";

const NEXT_STEP_PATH = "/calculators/ctc-to-in-hand";

export default function HraExemptionCalculatorPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [basicInput, setBasicInput] = useState("");
  const [hraInput, setHraInput] = useState("");
  const [rentInput, setRentInput] = useState("");
  const [isMetroCity, setIsMetroCity] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const monthlyBasicSalary = Number(basicInput) || 0;
  const monthlyHraReceived = Number(hraInput) || 0;
  const monthlyRentPaid = Number(rentInput) || 0;
  const hasError = hasSubmitted && (monthlyBasicSalary <= 0 || monthlyHraReceived <= 0);

  const result =
    hasSubmitted && !hasError
      ? calculateHraExemption({
          monthlyBasicSalary,
          monthlyHraReceived,
          monthlyRentPaid,
          isMetroCity,
        })
      : null;

  function handleCalculate() {
    setHasSubmitted(true);
    if (monthlyBasicSalary <= 0 || monthlyHraReceived <= 0) return;
    logMoneyGuruEvent(AnalyticEvent.CALCULATOR_RUN, {
      type: "hra_exemption",
    });
  }

  function handleInputChange(setter: (value: string) => void) {
    return (value: string) => {
      setter(value);
      setHasSubmitted(false);
    };
  }

  function handleNextStepClick() {
    logMoneyGuruEvent(AnalyticEvent.NEXT_STEP_CLICKED, {
      destination: NEXT_STEP_PATH,
    });
    router.push(NEXT_STEP_PATH);
  }

  return (
    <PageLayout navbarText={t("money_guru_hra_calculator_title")}>
      <CalculatorInputField
        label={t("money_guru_hra_calculator_basic_label")}
        type="currency"
        value={basicInput}
        hasError={hasError}
        onChange={handleInputChange(setBasicInput)}
      />
      <CalculatorInputField
        label={t("money_guru_hra_calculator_hra_label")}
        type="currency"
        value={hraInput}
        hasError={hasError}
        onChange={handleInputChange(setHraInput)}
      />
      <CalculatorInputField
        label={t("money_guru_hra_calculator_rent_label")}
        type="currency"
        value={rentInput}
        onChange={handleInputChange(setRentInput)}
      />

      <label className="text-caption mb-4" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input
          type="checkbox"
          checked={isMetroCity}
          onChange={(e) => {
            setIsMetroCity(e.target.checked);
            setHasSubmitted(false);
          }}
        />
        {t("money_guru_hra_calculator_metro_label")}
      </label>

      {hasError && (
        <p className="text-caption" style={{ color: "var(--clr-info-error-default)" }}>
          {t("money_guru_hra_calculator_error")}
        </p>
      )}

      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={handleCalculate}
      >
        {t("money_guru_calculator_calculate_cta")}
      </button>

      {result && (
        <CalculatorResultCard
          summary={t("money_guru_hra_calculator_summary")}
          lineItems={[
            {
              label: t("money_guru_hra_calculator_exempt"),
              value: formatToInr(result.monthlyExemptAmount),
              emphasis: true,
            },
            {
              label: t("money_guru_hra_calculator_taxable"),
              value: formatToInr(result.monthlyTaxableHra),
            },
          ]}
          nextStepLabel={t("money_guru_hra_calculator_next_step")}
          onNextStepClick={handleNextStepClick}
        />
      )}
    </PageLayout>
  );
}
