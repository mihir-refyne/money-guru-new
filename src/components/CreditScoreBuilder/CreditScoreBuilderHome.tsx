import useTranslation from "@/hooks/useTranslation";
import csbTopBanner from "@/images/build-credit-score-background.svg";
import lightning from "@/images/lighting.svg";
import Image from "next/image";
import CreditScoreBuilderFAQSection from "./CreditScoreBuilderFAQSection";
import CreditScoreProgressSection, {
  CreditScoreBuilderProgress,
} from "./CreditScoreProgressSection";

export default function CreditScoreBuilderHome({
  currentUserProgress = CreditScoreBuilderProgress.WITHDRAWAL_PENDING,
}: {
  currentUserProgress?: CreditScoreBuilderProgress;
}) {
  const { t } = useTranslation("common");
  return (
    <>
      <Image
        src={csbTopBanner}
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
        }}
        alt="bg"
      />
      <div
        style={{
          background: "var(--clr-bg-accent-highlight)",
          margin: "0 auto",
          borderRadius: "12px",
          padding: "14px 10px",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "0.2rem",
        }}
        className="text-medium text-body"
      >
        <Image src={lightning} alt="lighting" />
        <p>{t("credit_score_builder_social_proof")}</p>
        <Image src={lightning} alt="lighting" />
      </div>
      <CreditScoreProgressSection
        currentWithdrawalStatus={currentUserProgress}
      />
      <CreditScoreBuilderFAQSection />
    </>
  );
}
