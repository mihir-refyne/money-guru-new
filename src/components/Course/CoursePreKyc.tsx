import Image from "next/image";
import CenterContent from "../CenterContent";
import PageLayout from "../PageLayout";
import centerIllustration from "@/images/fin_course_pre_kyc_illustration.svg";
import useTranslation from "@/hooks/useTranslation";
import { APP_BASE_URL } from "@/constants";

interface CoursePreKyc {
  kycStatus: "NOT_VERIFIED" | "PENDING";
  onNavigate: (navigateTo: string, webviewRoute?: string) => void;
}

export default function CoursePreKyc({ kycStatus, onNavigate }: CoursePreKyc) {
  const { t } = useTranslation("common");

  function handleCtaClick() {
    const navigateTo =
      kycStatus === "PENDING"
        ? "/shorts#understanding-credit-score"
        : `${APP_BASE_URL}/#/?next=startActivation`;

    const webviewRoute = kycStatus === "PENDING" ? undefined : "dashboard";
    onNavigate(navigateTo, webviewRoute);
  }

  const title =
    kycStatus === "PENDING" ? t("kyc_in_progress") : t("complete_your_kyc");
  const description =
    kycStatus === "PENDING"
      ? t("it_will_take_some_time_verify")
      : t("to_start_fin_course");

  const ctaTopText =
    kycStatus === "PENDING" ? t("want_to_know_more_about_fin") : null;
  const ctaLabel =
    kycStatus === "PENDING" ? t("read_shorts_btn") : t("complete_kyc_btn");

  return (
    <PageLayout
      alignContentCenter
      footer={
        <div className="p-4">
          {ctaTopText && (
            <p className="text-body text-medium mb-4">{ctaTopText}</p>
          )}
          <button
            type="submit"
            className="btn btn-primary btn-block"
            onClick={handleCtaClick}
          >
            {ctaLabel}
          </button>
        </div>
      }
    >
      <CenterContent
        illustration={
          <Image src={centerIllustration} alt="Comple KYC process" />
        }
        title={title}
        description={description}
      />
    </PageLayout>
  );
}
