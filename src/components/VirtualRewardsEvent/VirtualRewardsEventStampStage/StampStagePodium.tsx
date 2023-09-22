import { type CSSProperties, useMemo } from "react";
import { StampPodium, StampPodiumStage } from "@/components/StampPodium";
import StampWrapper, {
  StampCountPosition,
  StampWrapperImage,
} from "@/components/StampWrapper";
import type { Stamp } from ".";

export interface StampPodiumStageConfig {
  backgroundColor?: string;
  stampBorderColor?: string;
  borderRadius?: string;
  count: number;
}

export interface StampStagePodiumProps {
  stamps: Array<Stamp>;
  background?: CSSProperties["background"];
  stampCountBorderColor?: CSSProperties["borderColor"];
  stampCountDisplayPosition?: StampCountPosition;
  hasBottomBorder?: boolean;
  podiumStages: Array<StampPodiumStageConfig>;
  onStampClick?: (stampId: string, stampInfo: Stamp["info"]) => void;
}

export default function StampStagePodium({
  stamps,
  background,
  stampCountBorderColor,
  stampCountDisplayPosition,
  hasBottomBorder = false,
  podiumStages,
  onStampClick,
}: StampStagePodiumProps) {
  const _podiumStages = useMemo(
    () => getStampsStageConfig(podiumStages, stamps),
    [podiumStages, stamps]
  );

  return (
    <StampPodium
      bottomBorderColor={
        hasBottomBorder
          ? _podiumStages[_podiumStages.length - 1].backgroundColor
          : undefined
      }
    >
      {_podiumStages.map((stampStage, stageIndex) => (
        <StampPodiumStage
          key={stageIndex}
          background={background}
          backgroundColor={stampStage.backgroundColor}
          borderRadius={stampStage.borderRadius}
        >
          {stampStage.stamps.map((stamp) => (
            <StampWrapper
              key={stamp.id}
              borderColor={stamp.borderColor}
              count={stamp.count}
              countBorderColor={stampCountBorderColor}
              countDisplayPosition={stampCountDisplayPosition}
              stampName={stamp.name}
              // TODO: Move it to config
              displayStampName
              disableWhenCountIsZero
              disableClickWhenDisabled={false}
              onClick={() => onStampClick?.(stamp.id, stamp.info)}
            >
              <StampWrapperImage
                imageUrl={stamp.imageUrl}
                name={stamp.name ?? "Stamp"}
              />
            </StampWrapper>
          ))}
        </StampPodiumStage>
      ))}
    </StampPodium>
  );
}

function getStampsStageConfig(
  podiumStages: Array<StampPodiumStageConfig>,
  stamps: Array<Stamp>
): Array<{
  backgroundColor?: string;
  borderRadius?: string;
  stamps: Array<
    Stamp & {
      borderColor?: string;
    }
  >;
}> {
  let lastEndIndex = 0;
  return podiumStages.map((stage) => {
    const { borderRadius, backgroundColor, stampBorderColor, count } = stage;

    const itemsRequiredInThisStage = count;
    const startIndex = lastEndIndex;
    const endIndex = startIndex + itemsRequiredInThisStage - 1;
    lastEndIndex = endIndex + 1;

    const stampsConfig: Array<
      Stamp & {
        borderColor?: string;
      }
    > = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const stampAtThisIndex = stamps[i];
      if (!stampAtThisIndex) continue;
      stampsConfig.push({
        ...stampAtThisIndex,
        borderColor: stampBorderColor,
      });
    }
    return { borderRadius, backgroundColor, stamps: stampsConfig };
  });
}
