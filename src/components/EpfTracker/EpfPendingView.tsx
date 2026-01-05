import { useEffect } from "react";
import Image from "next/image";
import { Info } from "phosphor-react";
import EpfTrackerLayout from "./EpfTrackerLayout";
import useTranslation from "@/hooks/useTranslation";
import epfHeroBlobImageUrl from "@/images/epf-hero-blob.png";

interface EpfPendingViewProps {
  directlyAccessed: boolean;
  onMount?: () => void;
}

const HEADER_BACKGROUND_COLOR = "linear-gradient( #EBF5FF 100% ,#FFFFFF 0%)";

export default function EpfPendingView({
  directlyAccessed,
  onMount,
}: EpfPendingViewProps) {
  const { tWithoutTypeSafety } = useTranslation("common");

  useEffect(() => {
    onMount?.();
  }, [onMount]);

  return (
    <EpfTrackerLayout
      hasContentPadding={false}
      hasFooter={false}
      dispatchPopEventOnBackClick={directlyAccessed}
      navbarBackground={HEADER_BACKGROUND_COLOR}
    >
      <div
        className="px-4 pt-6 flex-center"
        style={{
          backgroundImage: `url(${epfHeroBlobImageUrl.src}),${HEADER_BACKGROUND_COLOR}`,
          backgroundPositionX: "right",
          backgroundPositionY: "50%",
          backgroundRepeat: "no-repeat",
          paddingBottom: "6.4rem",
          minHeight: "calc(100vh - 64px)",
          flexDirection: "column",
        }}
      >
        <div
          className="flex-center"
          style={{
            width: "6.4rem",
            height: "6.4rem",
            borderRadius: "50%",
            backgroundColor: "var(--clr-brand-light)",
            marginBottom: "var(--spacing-6)",
          }}
        >
          <Info size={40} weight="fill" color="var(--clr-brand-default)" />
        </div>
        <h2 className="text-heading text-semibold text-center">
          {tWithoutTypeSafety("epf_pending_title")}
        </h2>
        <p className="text-body text-regular clr-text-secondary mt-4 text-center">
          {tWithoutTypeSafety("epf_pending_description")}
        </p>
      </div>
    </EpfTrackerLayout>
  );
}
