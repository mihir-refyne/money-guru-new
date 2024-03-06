import PageLayout from "@/components/PageLayout";
import Shorts from "@/components/Shorts";
import { getShortsByLocale } from "@/lib/shorts/server";
import { GetStaticProps } from "next";
import { marked } from "marked";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import shortsConfig from "../../data/shorts_config.json";
import { SurveyTriggerAction } from "@/lib/survey";
import { checkIfFeatureEnabledByReleaseConfig } from "@/lib/core/release-config";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import { isQuizEitherCompletedOrSkipped } from "@/lib/quiz";
import useMutation from "@/hooks/useMutation";
import { postUserAction } from "@/lib/core/user";
import constructElementId from "@/lib/utils/constructElementId";
import { ScreenName } from "@/constants/ScreenName";
import { getLastViewedShortId } from "@/lib/shorts";

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

type ShortItemType = ShortsPageProps["shorts"][number];

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

export default function ShortsPage({ shorts: rawShorts }: ShortsPageProps) {
  const router = useRouter();
  const { mutate } = useMutation(postUserAction);
  const [shortIdFromUrlHash, setShortIdFromUrlHash] = useState<string | null>(
    null
  );
  const [lastViewedShortIdOnLoad] = useState(getLastViewedShortId);

  const employerId = getValueFromMetadata("employerId");
  const workerId = getValueFromMetadata("workerId");

  const shorts = useMemo<Array<ShortItemType>>(() => {
    if (!shortIdFromUrlHash) return rawShorts;

    const startShortId = shortIdFromUrlHash;
    const lastViewedShortId = lastViewedShortIdOnLoad;

    if (lastViewedShortId)
      return getReOrderedShortsByStartAndLastViewedShortId(
        rawShorts,
        startShortId,
        lastViewedShortId
      );
    return getReOrderedShortsByStartShortId(rawShorts, startShortId);
  }, [shortIdFromUrlHash, lastViewedShortIdOnLoad, rawShorts]);

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
    setShortIdFromUrlHash(hash);
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
        reactionElementId={constructElementId({
          screenName: ScreenName.MONGU_R_SHORTS,
          elementName: "REACTION",
        })}
        persistShortView
      />
    </PageLayout>
  );
}

function getReOrderedShortsByStartShortId(
  shorts: Array<ShortItemType>,
  startShortId: string
): Array<ShortItemType> {
  const startShortIndex = shorts.findIndex(
    (short) => short.id === startShortId
  );
  if (startShortIndex < 0) return shorts;
  const newShortSeries = [...shorts];
  const itemToBeAddedAtStart = newShortSeries.splice(startShortIndex);
  return itemToBeAddedAtStart.concat(newShortSeries);
}

function getReOrderedShortsByStartAndLastViewedShortId(
  shorts: Array<ShortItemType>,
  startShortId: string,
  lastViewedShortId: string
): Array<ShortItemType> {
  const startShortIndex = shorts.findIndex(
    (short) => short.id === startShortId
  );
  if (startShortIndex < 0) return shorts;
  const newShortSeries = [...shorts];
  const startShortItem = newShortSeries.splice(startShortIndex, 1);

  const lastViewedShortIndex = newShortSeries.findIndex(
    (short) => short.id === lastViewedShortId
  );
  if (lastViewedShortIndex < 0)
    return getReOrderedShortsByStartShortId(shorts, startShortId);

  const nextShortAfterLastViewedIndex =
    lastViewedShortIndex === newShortSeries.length - 1
      ? 0
      : lastViewedShortIndex + 1;

  const itemToBeAddedAtStart = newShortSeries.splice(
    nextShortAfterLastViewedIndex
  );
  return startShortItem.concat(itemToBeAddedAtStart, newShortSeries);
}
