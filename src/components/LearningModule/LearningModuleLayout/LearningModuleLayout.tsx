import { ReactNode } from "react";
import PageLayout from "../../PageLayout";

interface LearningModuleContainerProps {
  children: ReactNode;
  hasContentPadding?: boolean;
  dispatchPopEventOnBackClick?: boolean;
}

export const LearningModuleLayout = ({
  hasContentPadding,
  children,
  dispatchPopEventOnBackClick,
}: LearningModuleContainerProps) => {
  return (
    <PageLayout
      navbarText={"Learning Module"}
      hasLocaleChange={false}
      hasShare={false}
      hasContentPadding={hasContentPadding}
      dispatchPopEventOnBackClick={dispatchPopEventOnBackClick}
    >
      {children}
    </PageLayout>
  );
};
