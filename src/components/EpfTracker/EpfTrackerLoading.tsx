import { CDN_BASE_URL } from "@/constants";
import useTranslation from "@/hooks/useTranslation";
import { CheckCircle } from "phosphor-react";
import PageLayout from "../PageLayout";
import RiveWrapper from "../RiveWrapper";

// TODO: This can be a Independent component, refactor later
export default function EpfTrackerLoading() {
  const { t } = useTranslation("common");
  return (
    <PageLayout
      navbarText=""
      hasLocaleChange={false}
      alignContentCenter
      hasHelpButton
      hasShare={false}
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

export function EpfTrackerSuccess() {
  const { t } = useTranslation("common");
  return (
    <PageLayout
      navbarText=""
      hasLocaleChange={false}
      alignContentCenter
      hasHelpButton
      hasShare={false}
    >
      <CheckCircle
        size={56}
        weight="fill"
        color="var(--clr-icon-accent-success)"
      />
      <h4 className="text-body text-semibold" style={{ marginTop: "16px" }}>
        {t("epf_tracker_loading_success")}
      </h4>
    </PageLayout>
  );
}
