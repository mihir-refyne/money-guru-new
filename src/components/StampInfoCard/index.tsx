import { ShareNetwork } from "phosphor-react";

interface StampInfoCardProps {
  illustrationUrl?: string;
  title?: string;
  description?: string;
  onShareClick?: (payload: { imageUrl: string; text: string }) => void;
  hasRequest?: boolean;
  onRequestClick?: () => void;
}

export default function StampInfoCard({
  illustrationUrl,
  title,
  description,
  onShareClick,
  hasRequest = true,
  onRequestClick,
}: StampInfoCardProps) {
  if (!illustrationUrl || !title || !description) return null;

  function handleShareClick() {
    if (!illustrationUrl || !title || !description) return;
    onShareClick?.({
      imageUrl: illustrationUrl,
      text: `${title}\n\n${description}`,
    });
  }

  return (
    <div>
      <img
        src={illustrationUrl}
        alt={title}
        width="100%"
        // TODO: Move it to config
        style={{ maxHeight: "11rem" }}
      />
      <h4 className="text-heading text-medium text-center mt-6 mb-3">
        {title}
      </h4>
      <p className="text-body clr-text-secondary text-center mb-8">
        {description}
      </p>
      <button
        className="btn btn-primary btn-block flex-center mb-2"
        onClick={handleShareClick}
      >
        <span className="mr-2">Share with Friends</span>
        <ShareNetwork size={16} />
      </button>
      {hasRequest && (
        <button className="btn btn-text btn-block" onClick={onRequestClick}>
          Request
        </button>
      )}
    </div>
  );
}
