import LoadingPage from "@/components/LoadingPage";
import PageLayout from "@/components/PageLayout";
import Shorts from "@/components/Shorts";
import { ScreenName } from "@/constants/ScreenName";
import useInfiniteFetcher from "@/hooks/useInfiniteFetcher";
import useMutation from "@/hooks/useMutation";
import { checkIfFeatureEnabledByReleaseConfig } from "@/lib/core/release-config";
import { postUserAction } from "@/lib/core/user";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import { isQuizEitherCompletedOrSkipped } from "@/lib/quiz";
import { shortsInfiniteFetcher } from "@/lib/shorts";
import { SurveyTriggerAction } from "@/lib/survey";
import constructElementId from "@/lib/utils/constructElementId";
import { marked } from "marked";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef } from "react";
import shortsConfig from "../../data/shorts_config.json";

const SCROLL_BUFFER_TO_FETCH = 3;

export interface ShortsPageProps {
  shorts: Array<{
    id: string;
    metadata: Record<string, unknown>;
    content: string;
    reaction: {
      liked: number;
    };
  }>;
}

export default function ShortsPage() {
  const router = useRouter();
  const { mutate } = useMutation(postUserAction);

  const employerId = getValueFromMetadata("employerId");
  const workerId = getValueFromMetadata("workerId");

  const countRef = useRef(0);

  const { data, isLoading, next } = useInfiniteFetcher(shortsInfiniteFetcher);

  const shorts = data ?? [];

  const quizToBeTriggeredOnShorts = useMemo<{
    quizId: string;
    shortIds: string[];
  } | null>(() => {
    const quizTriggerOnSwipeUpConfigOne = (
      shortsConfig.quizTriggerOnSwipeUpConfig as any[]
    ).find((config: any) => {
      const releaseConfigs = config?.releaseConfigs;
      if (!Array.isArray(releaseConfigs)) return true;
      return releaseConfigs.some((releaseConfig) =>
        checkIfFeatureEnabledByReleaseConfig(releaseConfig, {
          employerId,
          workerId,
        })
      );
    });
    if (!quizTriggerOnSwipeUpConfigOne) return null;
    return {
      quizId: quizTriggerOnSwipeUpConfigOne.quizId,
      shortIds: quizTriggerOnSwipeUpConfigOne.shortIds ?? [],
    };
  }, [shortsConfig.quizTriggerOnSwipeUpConfig]);

  useEffect(() => {
    if (!router.isReady || isLoading) return;
    const hash = router.asPath.split("#")[1];
    console.log("hash", hash);
    if (hash) {
      const currentScroll = data?.findIndex((d) => d.id === hash);
      countRef.current = currentScroll ?? 0;
      if (countRef.current >= (data?.length ?? 0) - SCROLL_BUFFER_TO_FETCH) {
        next();
      }
      router.replace(router.asPath, undefined, {
        shallow: true,
        scroll: false,
      });
    }
    mutate({
      actionType: "R_SHORT_VISITED",
      metadata: hash ? { rShortId: hash } : undefined,
    });
  }, [router.isReady, isLoading]);

  const shouldTriggerNext = useMemo(() => {
    console.log();
    if (countRef.current === (data?.length ?? 0) - SCROLL_BUFFER_TO_FETCH) {
      return true;
    }
    return false;
  }, [data]);

  function handleSwipeUp(id: string) {
    if (shouldTriggerNext) {
      next();
    }
    countRef.current = countRef.current + 1;
    if (quizToBeTriggeredOnShorts?.shortIds.includes(id)) {
      const isTheQuizAlreadySkippedOrSubmitted = isQuizEitherCompletedOrSkipped(
        quizToBeTriggeredOnShorts.quizId
      );
      if (isTheQuizAlreadySkippedOrSubmitted) return;
      const currentShortPath = encodeURIComponent(`/shorts#${id}`);
      router.push({
        pathname: "/quiz",
        query: {
          id: quizToBeTriggeredOnShorts.quizId,
          trigger: SurveyTriggerAction.MONEY_GURU_R_SHORT_SWIPE_UP,
          returnTo: currentShortPath,
        },
      });
    }
  }

  function handleSwipeDown() {
    if (countRef.current > 0) {
      countRef.current -= 1;
    }
  }

  if (isLoading) {
    return <LoadingPage />;
  }
  return (
    <PageLayout hasContentPadding={false}>
      <Shorts
        items={shorts.map((short) => ({
          type: "SHORT",
          data: {
            id: short.id,
            media: {
              type: short.metadata?.mediaType ?? ("image" as any),
              url: short.metadata?.mediaUrl ?? ("" as any),
              fullHeight: short.metadata?.mediaFullHeight ?? (false as any),
            },
            tag: short.metadata?.tag as any,
            content: (
              <article
                dangerouslySetInnerHTML={{ __html: marked(short.content) }}
              />
            ),
            reaction: short.reaction,
            publishedAt: parseAndValidatePublishedDate(
              short.metadata?.publishedAt,
              short.metadata?.tag
            ),
          },
        }))}
        onSwipeUp={handleSwipeUp}
        onSwipeDown={handleSwipeDown}
        hasEnd
        reactionElementId={constructElementId({
          screenName: ScreenName.MONGU_R_SHORTS,
          elementName: "REACTION",
        })}
      />
    </PageLayout>
  );
}

function parseAndValidatePublishedDate(
  publishedAt: any,
  tag: unknown
): Date | undefined {
  if (!publishedAt) return;
  // TODO: Get the tag from Manthan
  if (tag !== "News") return;
  try {
    return new Date(publishedAt);
  } catch (_) {
    return;
  }
}
