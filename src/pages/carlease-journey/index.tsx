import { useRouter } from "next/router";
import PageLayout from "@/components/PageLayout";
import { CARLEASE_JOURNEY_ROUTES } from "@/components/CarleaseJourney/constants";
import { useEffect, useRef } from "react";
import {
  SolidWhiteFooterActionButton,
  SolidFooterActionButton,
} from "@/components/CarleaseJourney/FooterActionButton";

export default function CarleaseJourneyPage() {
  return (
    <PageLayout
      pageBackground="transparent"
      hasContentPadding={false}
      hasLocalButton={false}
      transparentNavbar={true}
      hasBackButton={true}
      navbarFontColor="white"
    >
      <VideoPlayer />
      <VideoOverlay />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          color: "white",
          zIndex: 2,
        }}
      >
        <VideoForegroundTextContent />
        <FooterActionButtons />
      </div>
    </PageLayout>
  );
}
const VideoPlayer = () => {
  const VIDEO_SRC_URL =
    "https://assets.refyne.co.in/assets/videos/carlease_video.mp4";

  const handleVideoClick = (event: React.MouseEvent<HTMLVideoElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      onClick={handleVideoClick}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    >
      <source src={VIDEO_SRC_URL} type="video/mp4" />
    </video>
  );
};

const VideoOverlay = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: "0.75",
        backgroundColor: "#000000",
        zIndex: 1,
      }}
    />
  );
};

const VideoForegroundTextContent = () => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <p
        style={{
          textAlign: "center",
          fontWeight: 800,
          fontSize: "32px",
          lineHeight: "40px",
          margin: "0 0 16px 0",
        }}
      >
        Get your dream car with tax benefits
      </p>
      <p
        style={{
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: "24px",
          textAlign: "center",
          margin: 0,
        }}
      >
        {"WITH REFYNE'S CAR LEASE"}
      </p>
    </div>
  );
};

const FooterActionButtons = () => {
  const router = useRouter();
  return (
    <div
      style={{
        width: "100%",
        padding: "16px 24px",
        marginTop: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <SolidFooterActionButton
        label="Check benefits"
        onClick={() =>
          router.push(
            `${router.pathname}/${CARLEASE_JOURNEY_ROUTES.CARLEASE_LANDING_PAGE}`
          )
        }
      />
    </div>
  );
};
