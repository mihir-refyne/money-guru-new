import PageLayout from "@/components/PageLayout";
import Shorts from "@/components/Shorts";
import { getShortsByLocale } from "@/lib/shorts/server";
import { GetStaticProps } from "next";
import { marked } from "marked";
import { getValueFromMetadata } from "@/lib/core/user-metadata";

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
  const shareUrl =
    getValueFromMetadata("referralLink") ??
    process.env.NEXT_PUBLIC_APP_BASE_URL ??
    "https://app.refyne.co.in/";
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
          share: {
            imageUrl:
              "https://images.rawpixel.com/image_png_1000/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGQxMDMtbWlzY3RoZW1ldDAwMTQ4YS1pbWFnZS5wbmc.png",
            text: "Please share",
            url: shareUrl,
          },
        }))}
      />
    </PageLayout>
  );
}
