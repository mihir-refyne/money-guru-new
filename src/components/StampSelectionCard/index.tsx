import { useState } from "react";
import StampWrapper, { StampWrapperImage } from "../StampWrapper";

interface StampInfo {
  illustrationUrl: string;
  title: string;
  description: string;
}

interface Stamp {
  id: string;
  imageUrl: string;
  count: number;
  name?: string;
  info?: StampInfo;
}

interface StampSelectionCardProps {
  requestId?: string;
  title: string;
  description: string;
  stamps: Array<Stamp>;
  primaryCtaLabel: string;
  onStampSelectionChange?: (stampId: string, requestId?: string) => void;
  onPrimaryCtaClick?: (context: {
    stampId: string;
    stampName?: string;
    requestId?: string;
  }) => void;
}

const STAMP_BORDER_COLOR = "#ADD4FF";

export default function StampSelectionCard({
  requestId,
  title,
  description,
  stamps,
  primaryCtaLabel,
  onStampSelectionChange,
  onPrimaryCtaClick,
}: StampSelectionCardProps) {
  const [selectedStamp, setSelectedStamp] = useState<Stamp | null>(null);

  function handleStampClick(stamp: Stamp) {
    setSelectedStamp(stamp);
    onStampSelectionChange?.(stamp.id, requestId);
  }
  function handlePrimaryCtaClick() {
    if (selectedStamp) {
      onPrimaryCtaClick?.({
        stampId: selectedStamp.id,
        stampName: selectedStamp.name,
        requestId,
      });
    }
  }
  return (
    <div>
      <h4 className="text-heading text-medium text-center mb-2">{title}</h4>
      <p className="text-body clr-text-secondary text-center mb-6">
        {description}
      </p>
      <div
        className="mb-8"
        style={{
          display: "grid",
          columnGap: "2.4rem",
          rowGap: "1.6rem",
          gridTemplateColumns: "repeat(3, 1fr)",
          justifyItems: "center",
        }}
      >
        {stamps.map((stamp) => (
          <StampWrapper
            key={stamp.id}
            borderColor={STAMP_BORDER_COLOR}
            count={stamp.count}
            disableWhenCountIsZero
            checked={stamp.id === selectedStamp?.id}
            onClick={() => handleStampClick(stamp)}
          >
            <StampWrapperImage
              imageUrl={stamp.imageUrl}
              name={stamp.name ?? "Stamp"}
            />
          </StampWrapper>
        ))}
      </div>
      <button
        className="btn btn-primary btn-block"
        disabled={selectedStamp === null}
        onClick={handlePrimaryCtaClick}
      >
        {primaryCtaLabel}
      </button>
    </div>
  );
}
