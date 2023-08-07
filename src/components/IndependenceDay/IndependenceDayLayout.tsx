import PageLayout, { type PageLayoutProps } from "../PageLayout";

interface IndependenceDayLayoutProps
  extends Pick<
    PageLayoutProps,
    "navbarText" | "children" | "footer" | "preloads"
  > {}

export default function IndependenceDayLayout(
  props: IndependenceDayLayoutProps
) {
  return (
    <PageLayout
      title="Refyne Independence Day Event"
      description="Refyne Independence Day Event"
      dispatchPopEventOnBackClick
      hasNavbar
      transparentNavbar
      hasBackButton
      hasContentPadding={false}
      hasLocaleChange={false}
      {...props}
    />
  );
}
