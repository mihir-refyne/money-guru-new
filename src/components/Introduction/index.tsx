import { useState } from "react";
import PageLayout from "../PageLayout";
import IntroductionStoryItem, {
  IntroductionStoryItemProps,
} from "./IntroductionStoryItem";
import styles from "./Introduction.module.css";
import Stories from "../Stories";
import { isCurrentlyOnRefyneWebview } from "@/lib/webview";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import useTranslation from "@/hooks/useTranslation";

interface IntroductionStoryItemConfig extends IntroductionStoryItemProps {
  backgroundColor?: string;
  durationInMs?: number;
}

interface IntroductionProps {
  stories: Array<IntroductionStoryItemConfig>;
  onSkipClick?: () => void;
  onComplete?: () => void;
}

export default function Introduction({
  stories,
  onComplete,
  onSkipClick,
}: IntroductionProps) {
  const { t, tWithoutTypeSafety } = useTranslation("common");
  const [backgroundColor, setBackgroundColor] = useState<string>();
  function handleStoryOnMount(context: { backgroundColor?: string }) {
    setBackgroundColor(context.backgroundColor);
  }
  const isWebviewInsideRefyneApp = isCurrentlyOnRefyneWebview(
    getValueFromMetadata("appPlatformName")
  );
  return (
    <PageLayout
      hasNavbar={false}
      hasContentPadding={false}
      dispatchPopEventOnBackClick={isWebviewInsideRefyneApp}
    >
      <div
        className={styles.Introduction}
        style={{
          background: backgroundColor,
        }}
      >
        <div className={styles.Introduction__Body}>
          <Stories
            stories={getStories(
              stories,
              handleStoryOnMount,
              tWithoutTypeSafety
            )}
            storyContainerStyles={{ background: "unset" }}
            progressStyles={{ backgroundColor: "var(--clr-text-primary)" }}
            progressWrapperStyles={{ backgroundColor: "var(--clr-pure-white)" }}
            onAllStoriesEnd={onComplete}
          />
        </div>
        <footer className="my-2 text-center">
          <button className="btn btn-text btn-inline" onClick={onSkipClick}>
            {t("skip")}
          </button>
        </footer>
      </div>
    </PageLayout>
  );
}

function getStories(
  _stories: Array<IntroductionStoryItemConfig>,
  onMount: (context: { backgroundColor?: string }) => void,
  translate: (code: string) => string
) {
  const stories = _stories.map(({ durationInMs, ...props }) => {
    return {
      duration: durationInMs,
      content: () => {
        return (
          <IntroductionStoryItem
            {...props}
            heading={props.heading ? translate(props.heading) : undefined}
            onMount={() => onMount({ backgroundColor: props.backgroundColor })}
          />
        );
      },
    };
  });
  return stories;
}
