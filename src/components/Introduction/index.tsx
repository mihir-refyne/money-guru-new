import { useState } from "react";
import PageLayout from "../PageLayout";
import IntroductionStoryItem, {
  IntroductionStoryItemProps,
} from "./IntroductionStoryItem";
import styles from "./Introduction.module.css";
import Stories from "../Stories";

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
  const [backgroundColor, setBackgroundColor] = useState<string>();
  function handleStoryOnMount(context: { backgroundColor?: string }) {
    setBackgroundColor(context.backgroundColor);
  }
  return (
    <PageLayout
      hasNavbar={false}
      hasContentPadding={false}
      dispatchPopEventOnBackClick
    >
      <div
        className={styles.Introduction}
        style={{
          background: backgroundColor,
        }}
      >
        <div className={styles.Introduction__Body}>
          <Stories
            stories={getStories(stories, handleStoryOnMount)}
            storyContainerStyles={{ background: "unset" }}
            progressStyles={{ backgroundColor: "var(--clr-text-primary)" }}
            progressWrapperStyles={{ backgroundColor: "var(--clr-pure-white)" }}
            onAllStoriesEnd={onComplete}
          />
        </div>
        <footer className="my-2 text-center">
          <button className="btn btn-text btn-inline" onClick={onSkipClick}>
            Skip
          </button>
        </footer>
      </div>
    </PageLayout>
  );
}

function getStories(
  _stories: Array<IntroductionStoryItemConfig>,
  onMount: (context: { backgroundColor?: string }) => void
) {
  const stories = _stories.map(({ durationInMs, ...props }) => {
    return {
      duration: durationInMs,
      content: () => {
        return (
          <IntroductionStoryItem
            {...props}
            onMount={() => onMount({ backgroundColor: props.backgroundColor })}
          />
        );
      },
    };
  });
  return stories;
}
