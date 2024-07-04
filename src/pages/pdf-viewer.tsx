import { useRouter } from "next/router";
import PageLayout from "../components/PageLayout";
import CircularSpinner from "../components/CircularSpinner";
import { CSSProperties, useState } from "react";

export default function PDFViewerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  if (!router.isReady) return null;
  const url = router.query.url?.toString();
  if (!url) return null;

  const updatedUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
    url
  )}&embedded=true`;
  const iframeStyle: CSSProperties = isLoading
    ? { visibility: "hidden", height: 0 }
    : { height: "92vh" };

  return (
    <PageLayout
      alignContentCenter
      hasContentPadding={false}
      hasLocaleChange={false}
      hasShare={false}
    >
      {isLoading && <CircularSpinner />}
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        src={updatedUrl}
        title="PDF Viewer"
        style={iframeStyle}
        onLoad={() => {
          setIsLoading(false);
        }}
        onError={() => {
          setIsLoading(false);
        }}
      />
    </PageLayout>
  );
}
