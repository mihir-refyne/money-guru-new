import Image from "next/image";
import { useRouter } from "next/router";
import useTranslation from "@/hooks/useTranslation";
import { FooterButton } from "@/components/TwoWheelerLoan/FooterButton";
import PageLayout from "@/components/PageLayout";
import chevronRight from "@/images/chevron_right.svg";
import styles from "../../two-wheeler-loan/styles.module.css";
import applicationStatusStyles from "./styles.module.css";
import { fetchAllLoans, LoanStatus } from "@/lib/two-wheeler-loan";
import { SanctionedDetailsSection } from "@/components/TwoWheelerLoan/ApplicationStatus/SanctionedDetailsSection";
import { ApplicationStatusCard } from "@/components/TwoWheelerLoan/ApplicationStatus/ApplicationStatusCard";
import useFetcher from "@/hooks/useFetcher";
import LoadingPage from "@/components/LoadingPage";
import { TwoWheelerRoutes } from "@/components/TwoWheelerLoan/constants";

export default function LoanApplicationStatus() {
  const { t } = useTranslation("common");
  const router = useRouter();

  const { isLoading, data: loansData, error } = useFetcher(fetchAllLoans);

  if (isLoading) {
    return <LoadingPage />;
  }

  const status = (loansData && loansData[0].status) || LoanStatus.INITIATED;

  return (
    <PageLayout
      pageBackground={"var(--clr-background-surface)"}
      hasContentPadding={true}
      hasLocalButton={false}
      hasBackButton={true}
      navbarBackground={"transparent"}
      navbarText="Application Status"
      footer={
        <FooterButton
          isButtonDisabled={false}
          label={t("two_wheeler_application_status_footer_cta_label")}
          onClick={() => {
            router.push("/");
          }}
        />
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <ApplicationStatusCard vehicleLoan={loansData && loansData[0]} />

        {status === LoanStatus.INITIATED && <WhatNextSection />}
        {status === LoanStatus.APPROVED && (
          <SanctionedDetailsSection vehicleLoan={loansData && loansData[0]} />
        )}
        <NeedSupportSection />
      </div>
    </PageLayout>
  );
}

const NeedSupportSection = () => {
  const { t } = useTranslation("common");

  return (
    <div>
      <p className={applicationStatusStyles.need_support__title}>
        {t("application_status_need_support")}
      </p>
      <div
        className={styles.outer_wrapper}
        style={{
          justifyContent: "space-between",
        }}
      >
        {" "}
        <p className={applicationStatusStyles.need_support__faq}>
          {t("application_status_faqs")}
        </p>
        <Image src={chevronRight} alt="right arrow" />
      </div>
    </div>
  );
};

const WhatNextSection = () => {
  const { t } = useTranslation("common");

  const WhatsNextData = [
    t("application_status_whats_next_step_1"),
    t("application_status_whats_next_step_2"),
    t("application_status_whats_next_step_3"),
  ];

  return (
    <div>
      <p className={applicationStatusStyles.whats_next__title}>
        {t("application_status_whats_next")}
      </p>
      <div
        className={styles.outer_wrapper}
        style={{
          flexDirection: "column",
        }}
      >
        {WhatsNextData.map((item, index) => {
          return (
            <div
              key={index}
              className={`${applicationStatusStyles.whats_next__item} ${
                index !== WhatsNextData.length - 1 &&
                applicationStatusStyles.whats_next__item__bordered
              }`}
            >
              <div className={applicationStatusStyles.whats_next__number}>
                {index + 1}
              </div>
              <p className={applicationStatusStyles.whats_next__description}>
                {item}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
