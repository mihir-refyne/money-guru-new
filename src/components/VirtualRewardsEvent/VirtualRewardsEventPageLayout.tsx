import PageLayout, { type PageLayoutProps } from "../PageLayout";

interface VirtualRewardsEventLayoutProps
  extends Pick<
    PageLayoutProps,
    "navbarText" | "children" | "footer" | "preloads" | "title" | "description"
  > {}

export default function VirtualRewardsEventPageLayout(
  props: VirtualRewardsEventLayoutProps
) {
  return (
    <PageLayout
      title="Refyne Rewards"
      description="Refyne Rewards"
      dispatchPopEventOnBackClick
      hasNavbar
      transparentNavbar
      hasBackButton
      hasShare={false}
      hasContentPadding={false}
      hasLocaleChange={false}
      {...props}
    />
  );
}
