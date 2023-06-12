import PageLayout from "@/components/PageLayout";
import Shorts from "@/components/Shorts";
import { getShortsByLocale } from "@/lib/shorts/server";
import { GetStaticProps } from "next";
import { marked } from "marked";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface ShortsPageProps {
  shorts: Array<{
    id: string;
    metadata: Record<string, unknown>;
    content: string;
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
  }, [router.isReady]);

  return (
    <PageLayout hasContentPadding={false}>
      <Shorts
        items={shorts.map((short) => ({
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
        }))}
      />
    </PageLayout>
  );
}
