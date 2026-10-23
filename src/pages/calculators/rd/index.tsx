import CalculatorInputField from "@/components/CalculatorInputField";
import CalculatorResultCard from "@/components/CalculatorResultCard";
import PageLayout from "@/components/PageLayout";
import useTranslation from "@/hooks/useTranslation";
import { AnalyticEvent } from "@/lib/analytics/events";
import { logMoneyGuruEvent } from "@/lib/analytics/money-guru";
import { calculateRdMaturityValue } from "@/lib/calculators/rd";
import { formatToInr } from "@/lib/utils";
import { useRouter } from "next/router";
import { useState } from "react";

const NEXT_STEP_PATH = "/calculators/sip-goal-planner";

export default function RdCalculatorPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [depositInput, setDepositInput] = useState("");
  const [rateInput, setRateInput] = useState("");
  const [tenureInput, setTenureInput] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const monthlyDeposit = Number(depositInput) || 0;
  const annualRatePercent = Number(rateInput) || 0;
  const tenureMonths = Number(tenureInput) || 0;
  const hasError =
    hasSubmitted &&
    (monthlyDeposit <= 0 || annualRatePercent <= 0 || tenureMonths <= 0);

  const maturityValue =
    hasSubmitted && !hasError
      ? calculateRdMaturityValue(monthlyDeposit, annualRatePercent, tenureMonths)
      : null;

  function handleInputChange(setter: (value: string) => void) {
    return (value: string) => {
      setter(value);
      setHasSubmitted(false);
    };
  }

  function handleCalculate() {
    setHasSubmitted(true);
    if (monthlyDeposit <= 0 || annualRatePercent <= 0 || tenureMonths <= 0)
      return;
    logMoneyGuruEvent(AnalyticEvent.CALCULATOR_RUN, { type: "rd" });
  }

  function handleNextStepClick() {
    logMoneyGuruEvent(AnalyticEvent.NEXT_STEP_CLICKED, {
      destination: NEXT_STEP_PATH,
    });
    router.push(NEXT_STEP_PATH);
  }

  return (
    <PageLayout navbarText={t("money_guru_rd_calculator_title")}>
      <CalculatorInputField
        label={t("money_guru_rd_deposit_label")}
        type="currency"
        value={depositInput}
        hasError={hasError}
        onChange={handleInputChange(setDepositInput)}
      />
      <CalculatorInputField
        label={t("money_guru_rd_rate_label")}
        type="number"
        value={rateInput}
        hasError={hasError}
        onChange={handleInputChange(setRateInput)}
      />
      <CalculatorInputField
        label={t("money_guru_rd_tenure_label")}
        type="number"
        value={tenureInput}
        hasError={hasError}
        errorMessage={t("money_guru_rd_error")}
        onChange={handleInputChange(setTenureInput)}
      />

      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={handleCalculate}
      >
        {t("money_guru_calculator_calculate_cta")}
      </button>

      {maturityValue !== null && (
        <CalculatorResultCard
          summary={t("money_guru_rd_summary")}
          lineItems={[
            {
              label: t("money_guru_rd_invested"),
              value: formatToInr(monthlyDeposit * tenureMonths),
            },
            {
              label: t("money_guru_rd_maturity_value"),
              value: formatToInr(maturityValue),
              emphasis: true,
            },
          ]}
          nextStepLabel={t("money_guru_rd_next_step")}
          onNextStepClick={handleNextStepClick}
        />
      )}
    </PageLayout>
  );
}
