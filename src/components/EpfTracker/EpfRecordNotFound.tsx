import { ArrowClockwise } from "phosphor-react";
import NoRecordFound from "../NoRecordFound";
import EpfTrackerLayout from "./EpfTrackerLayout";

interface EpfRecordNotFoundProps {
  directlyAccessed: boolean;
  onRetryClick?: () => void;
}

export default function EpfRecordNotFound({
  directlyAccessed,
  onRetryClick,
}: EpfRecordNotFoundProps) {
  return (
    <EpfTrackerLayout
      alignContentCenter
      footer={
        <button
          className="btn btn-primary btn-block flex-center"
          onClick={onRetryClick}
        >
          <span>Retry</span>
          <ArrowClockwise size={16} className="ml-2" />
        </button>
      }
      dispatchPopEventOnBackClick={directlyAccessed}
    >
      <NoRecordFound
        transparent
        title="We couldn’t fetch your PF details"
        description="Please click on retry"
      />
    </EpfTrackerLayout>
  );
}
