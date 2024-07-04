import { GetStaticProps } from "next";
import PageLayout from "../components/PageLayout";
import Shorts, { ShortItem } from "@/components/Shorts";
import { getShortsByLocale } from "../lib/shorts/server";
import { marked } from "marked";
import { useMemo } from "react";

interface RajGovtCircularPageProps {
  shorts: Array<{
    id: string;
    metadata: Record<string, unknown>;
    content: string;
    reaction: {
      liked: number;
    };
  }>;
}

export const getStaticProps: GetStaticProps<RajGovtCircularPageProps> = async (
  context
) => {
  const { locale = "en" } = context;
  const shorts = await getShortsByLocale(
    locale,
    "data/raj-govt-circular-shorts"
  );

  return {
    props: {
      shorts,
    },
  };
};

function parseDate(date?: unknown): Date | undefined {
    if (!date) return;
    return new Date(date.toString());
}

function generateShortItems(
  shorts: RajGovtCircularPageProps["shorts"]
): Array<ShortItem> {
  return shorts.map((short) => ({
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
          dangerouslySetInnerHTML={{
            __html: marked(short.content),
          }}
        />
      ),
      reaction: short.reaction,
      publishedAt: parseDate(short.metadata?.publishedAt),
    },
  }));
}

export default function RajGovtCircularPage({
  shorts,
}: RajGovtCircularPageProps) {
  const shortItems = useMemo(() => generateShortItems(shorts), [shorts]);

  return (
    <PageLayout hasContentPadding={false}>
      <Shorts items={shortItems} eventMetadata={{ short_type: "circular" }} />
    </PageLayout>
  );
}
