import PageLayout from "@/components/PageLayout";
import Shorts from "@/components/Shorts";
import { getShortsByLocale } from "@/lib/shorts/server";
import { GetStaticProps } from "next";
import { marked } from "marked";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import shortsConfig from "../../data/shorts_config.json";
import { SurveyTriggerAction } from "@/lib/survey";
import { checkIfFeatureEnabledByReleaseConfig } from "@/lib/core/release-config";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import { isQuizEitherCompletedOrSkipped } from "@/lib/quiz";
import useMutation from "@/hooks/useMutation";
import { postUserAction } from "@/lib/core/user";

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

export const getStaticProps: GetStaticProps<ShortsPageProps> = async (
  context
) => {
  const { locale = "en" } = context;
  const shorts = await getShortsByLocale(locale);

  return {
    props: {
      shorts,
    },
  };
};

export default function ShortsPage({ shorts }: ShortsPageProps) {
  const router = useRouter();
  const { mutate } = useMutation(postUserAction);

  const employerId = getValueFromMetadata("employerId");
  const workerId = getValueFromMetadata("workerId");

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
    if (!router.isReady) return;
    const hash = router.asPath.split("#")[1];
    if (hash) {
      const path = router.asPath.replace(`#${hash}`, "");
      router.replace(path, undefined, {
        shallow: true,
        scroll: false,
      });
    }
    mutate({
      actionType: "R_SHORT_VISITED",
      metadata: hash ? { rShortId: hash } : undefined,
    });
  }, [router.isReady]);

  function handleSwipeUp(id: string) {
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
          },
        }))}
        onSwipeUp={handleSwipeUp}
        hasEnd
      />
    </PageLayout>
  );
}
