import { useState } from "react";
import PageLayout from "../PageLayout";
import IntroductionStoryItem, {
  IntroductionStoryItemProps,
  IntroStoryFooterdCta,
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
  finalStoryFooterCtaConfig?: IntroStoryFooterdCta;
  loop?: boolean;
}

export default function Introduction({
  stories,
  onComplete,
  onSkipClick,
  finalStoryFooterCtaConfig,
  loop = true,
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
          <div className="text-right">
            <button
              className="btn btn-text btn-inline text-semibold"
              onClick={onSkipClick}
            >
              {t("skip")} &gt;
            </button>
          </div>
          <Stories
            stories={getStories({
              _stories: stories,
              onMount: handleStoryOnMount,
              translate: tWithoutTypeSafety,
              finalStoryFooterCtaConfig,
            })}
            storyContainerStyles={{ background: "unset" }}
            progressStyles={{ backgroundColor: "var(--clr-brand-default)" }}
            progressWrapperStyles={{
              backgroundColor: "#BAD7FF",
            }}
            onAllStoriesEnd={onComplete}
            loop={loop}
          />
        </div>
      </div>
    </PageLayout>
  );
}

function getStories(props: {
  _stories: Array<IntroductionStoryItemConfig>;
  onMount: (context: { backgroundColor?: string }) => void;
  translate: (code: string) => string;
  finalStoryFooterCtaConfig?: IntroStoryFooterdCta;
}) {
  const { _stories, onMount, translate, finalStoryFooterCtaConfig } = props;
  const lastStoryIndex = _stories.length - 1;
  const stories = _stories.map(({ durationInMs, ...props }, index) => {
    return {
      duration: durationInMs,
      content: () => {
        return (
          <IntroductionStoryItem
            {...props}
            heading={props.heading ? translate(props.heading) : undefined}
            onMount={() => onMount({ backgroundColor: props.backgroundColor })}
            footerCta={
              index === lastStoryIndex ? finalStoryFooterCtaConfig : undefined
            }
          />
        );
      },
    };
  });
  return stories;
}
