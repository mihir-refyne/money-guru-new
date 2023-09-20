import StampStagePodium, { StampStagePodiumProps } from "./StampStagePodium";

interface StampInfo {
  illustrationUrl: string;
  title: string;
  description: string;
}

export interface Stamp {
  id: string;
  imageUrl: string;
  count: number;
  name?: string;
  info?: StampInfo;
}

type VirtualRewardsEventStampStageProps = StampStagePodiumProps;

export default function VirtualRewardsEventStampStage(
  props: VirtualRewardsEventStampStageProps
) {
  return <StampStagePodium {...props} />;
}
