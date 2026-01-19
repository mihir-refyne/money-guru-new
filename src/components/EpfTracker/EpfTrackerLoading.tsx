import { CDN_BASE_URL } from "@/constants";
import useTranslation from "@/hooks/useTranslation";
import PageLayout from "../PageLayout";
import RiveWrapper from "../RiveWrapper";

// TODO: This can be a Independent component, refactor later
export default function EpfTrackerLoading() {
  const { t } = useTranslation("common");
  return (
    <PageLayout
      navbarText={t("pf_passbook_label")}
      hasLocaleChange={false}
      alignContentCenter
    >
      <RiveWrapper
        src={`${CDN_BASE_URL}/assets/animations/unified_loader.riv`}
        style={{
          height: "100px",
        }}
      />
      <p className="clr-text-secondary">{t("fetching_epf_records")}</p>
      <p className="clr-text-secondary">{t("fetching_delay_notice")}</p>
    </PageLayout>
  );
}
