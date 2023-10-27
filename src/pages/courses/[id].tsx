import { ReactNode, useCallback, useMemo } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import {
  ShortsPageProps,
  getStaticProps as getStaticPropsOnShortsPage,
} from "../shorts";
import _config from "../../../data/courses_config.json";
import PageLayout from "@/components/PageLayout";
import { marked } from "marked";
import { ShortData } from "@/components/Shorts/ShortItem";
import Shorts from "@/components/Shorts";
import Quiz from "@/components/Quiz";
import { getSurveyTriggerFromStringValue } from "@/components/Quiz/helpers";
import CoursePreKyc from "@/components/Course/CoursePreKyc";
import {
  dispatchDataToNativePlatform,
  isCurrentlyOnRefyneWebview,
} from "@/lib/webview";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import { UserStatus } from "@/lib/core/user";

const config = _config as CoursesConfig;

type ShortItem = ShortsPageProps["shorts"][number];

type StortItemMapById = Record<string, ShortItem>;

type CourseItemConfig =
  | { type: "short"; content: { shortId: string } }
  | { type: "quiz"; content: { quizId: string; surveyTriggerAction: string } };
interface CoursesConfig {
  courses: Array<{ id: string; items: Array<CourseItemConfig> }>;
}

type CourseShortItem = { type: "short"; content: ShortItem };
type CourseQuizItem = {
  type: "quiz";
  content: {
    quizId: string;
    surveyTriggerAction: string;

    startPageIllustrationUrl?: string;
    startPageTitle?: string;
    startPageDescription?: string;
    startPageStartCtaLabel?: string;
    startPageCanSkip?: boolean;
    startPageSkipCtaLabel?: string;
    completedPageIllustrationUrl?: string;
    completedPageTitle?: string;
    completedPageDescription?: string;
    completedPageBackCtaLabel?: string;
  };
};
type CourseItem = CourseShortItem | CourseQuizItem;

interface CoursePageProps {
  id: string;
  items: Array<CourseItem>;
}

export const getStaticPaths: GetStaticPaths<{ id: string }> = ({
  locales = [],
}) => {
  const courses = config.courses;
  const paths = courses.flatMap((course) => {
    return locales.map((locale) => {
      return {
        params: {
          id: course.id,
        },
        locale,
      };
    });
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  CoursePageProps,
  { id: string }
> = async (context) => {
  const courseId = context.params?.id;
  if (!courseId)
    throw new Error("courseId missing at getStaticProps of courses page");
  const { props } = (await getStaticPropsOnShortsPage(context)) as {
    props: ShortsPageProps;
  };
  const shorts = props.shorts;
  const shortsMapById = shorts.reduce((accum, curr) => {
    accum[curr.id] = curr;
    return accum;
  }, {} as StortItemMapById);
  const courses = config.courses;
  const course = courses.find((course) => course.id === courseId);

  if (!course) throw new Error(`Course config not found for id: ${courseId}`);

  const couseItems = course.items.map<CourseItem>((item) => {
    if (item.type === "quiz") return { type: "quiz", content: item.content };
    return { type: "short", content: shortsMapById[item.content.shortId] };
  });

  return {
    props: {
      id: course.id,
      items: couseItems,
    },
  };
};

export default function CoursePage({ id, items }: CoursePageProps) {
  const router = useRouter();
  const userStatus = getValueFromMetadata("status");
  const appPlatformName = getValueFromMetadata("appPlatformName");
  const handleQuizFinish = useCallback(() => {
    router.push("/");
  }, []);
  const shortItems = useMemo(
    () => getShortItems(id, items, { onBackClick: handleQuizFinish }),
    [items, handleQuizFinish]
  );

  function handleNavigate(navigateTo: string, webviewRoute?: string) {
    const isWebviewInsideRefyneApp =
      isCurrentlyOnRefyneWebview(appPlatformName);
    if (isWebviewInsideRefyneApp && webviewRoute) {
      return dispatchDataToNativePlatform({
        type: "ROUTE_TO_SCREEN",
        body: {
          screenName: webviewRoute,
        },
      });
    }
    router.push(navigateTo);
  }

  const kycStatus = getKycStatusIfNotVerified(userStatus);

  if (kycStatus)
    return <CoursePreKyc kycStatus={kycStatus} onNavigate={handleNavigate} />;

  return (
    <PageLayout hasContentPadding={false}>
      <Shorts items={shortItems} eventMetadata={{ course_id: id }} />
    </PageLayout>
  );
}

function getKycStatusIfNotVerified(
  userStatus?: string
): "NOT_VERIFIED" | "PENDING" | undefined {
  if (!userStatus) return;
  if (userStatus === UserStatus.REFYNE_VERIFIED) return;
  if (
    userStatus === UserStatus.VERIFICATION_PENDING ||
    userStatus === UserStatus.USER_MODIFIED_VERIFICATION_PENDING
  ) {
    return "PENDING";
  }
  return "NOT_VERIFIED";
}

type ShortItemType =
  | {
      type: "SHORT";
      data: ShortData;
    }
  | {
      type: "FILLER";
      data: ReactNode;
    };
function getShortItems(
  courseId: string,
  courseItems: Array<CourseItem>,
  handlers: {
    onBackClick: () => void;
  }
): Array<ShortItemType> {
  const shortItems: Array<ShortItemType> = [];
  for (const courseItem of courseItems) {
    if (courseItem.type === "short") {
      const short = courseItem.content;
      shortItems.push({
        type: "SHORT",
        data: {
          id: short.id,
          media: {
            type: short.metadata?.mediaType ?? ("image" as any),
            url: short.metadata?.mediaUrl ?? ("" as any),
          },
          tag: short.metadata?.tag as any,
          content: (
            <article
              dangerouslySetInnerHTML={{ __html: marked(short.content) }}
            />
          ),
          reaction: short.reaction,
        },
      });
    }
    if (courseItem.type === "quiz") {
      const surveyTriggerAction = getSurveyTriggerFromStringValue(
        courseItem.content.surveyTriggerAction
      );
      if (surveyTriggerAction) {
        shortItems.push({
          type: "FILLER",
          data: (
            <div className="p-4 flex-grow-1">
              <Quiz
                {...courseItem.content}
                surveyTriggerAction={surveyTriggerAction}
                hasNavbar={false}
                startPageCanSkip={false}
                eventMetadata={{ course_id: courseId }}
                onBackClick={handlers.onBackClick}
              />
            </div>
          ),
        });
      }
    }
  }
  return shortItems;
}
