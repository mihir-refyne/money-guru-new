import PageLayout from "../PageLayout";
import LoaderWrapper, { LoaderType } from "../SkeletonLoader";

const LOADER_BACKGROUND_STYLE = `linear-gradient(
    90deg,
    #ffff 0px,
    rgba(229, 229, 229, 0.7) 40px,
    #ffff 80px
  )`;

export default function VoucherPageSkeletonLoader(props: { navbarText: string }) {
  return (
    <PageLayout
      title={props.navbarText}
      navbarText={props.navbarText}
      hasContentPadding
      hasLocaleChange={false}
      hasShare={false}
      pageBackground="#F7F7F7"
    >
      <div style={{ marginTop: "3.2rem" }}>
        <LoaderWrapper
          isLoading={true}
          loaderType={LoaderType.CUSTOM_BOX}
          height="40vh"
          width="100%"
          background={LOADER_BACKGROUND_STYLE}
          borderRadius={16}
        ></LoaderWrapper>
      </div>
      <div style={{ marginTop: "3.2rem" }}>
        <LoaderWrapper
          isLoading={true}
          loaderType={LoaderType.CUSTOM_BOX}
          height="9rem"
          width="100%"
          background={LOADER_BACKGROUND_STYLE}
          borderRadius={16}
        ></LoaderWrapper>
      </div>
      <div style={{ marginTop: "3.2rem" }}>
        <LoaderWrapper
          isLoading={true}
          loaderType={LoaderType.CUSTOM_BOX}
          height="9rem"
          width="100%"
          background={LOADER_BACKGROUND_STYLE}
          borderRadius={16}
        ></LoaderWrapper>
      </div>
    </PageLayout>
  );
}
