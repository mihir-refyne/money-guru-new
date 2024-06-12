import LoaderWrapper, { LoaderType } from "../SkeletonLoader";
import styles from "./ShortsContainerLayoutLoader.module.css";

export default function ShortsContainerLayoutLoader() {
  return (
    <div className={styles.Short__Container_Layout_Loader}>
      <LoaderWrapper
        isLoading={true}
        loaderType={LoaderType.CUSTOM_BOX}
        height="24rem"
        width="100%"
      ></LoaderWrapper>

      <div style={{ marginTop: "1.6rem" }}>
        <LoaderWrapper
          isLoading={true}
          loaderType={LoaderType.CUSTOM_BOX}
          height="6rem"
          width="100%"
        ></LoaderWrapper>
      </div>

      <div style={{ marginTop: "1.6rem" }}>
        <LoaderWrapper
          isLoading={true}
          loaderType={LoaderType.CUSTOM_BOX}
          height="4rem"
          width="100%"
        ></LoaderWrapper>
      </div>
      <div style={{ marginTop: "1.6rem" }}>
        <LoaderWrapper
          isLoading={true}
          loaderType={LoaderType.CUSTOM_BOX}
          height="4rem"
          width="100%"
        ></LoaderWrapper>
      </div>
      <div style={{ marginTop: "1.6rem" }}>
        <LoaderWrapper
          isLoading={true}
          loaderType={LoaderType.CUSTOM_BOX}
          height="4rem"
          width="100%"
        ></LoaderWrapper>
      </div>
      <div style={{ marginTop: "7rem" }}>
        <LoaderWrapper
          isLoading={true}
          loaderType={LoaderType.CUSTOM_BOX}
          height="4rem"
          width="100%"
        ></LoaderWrapper>
      </div>
    </div>
  );
}
