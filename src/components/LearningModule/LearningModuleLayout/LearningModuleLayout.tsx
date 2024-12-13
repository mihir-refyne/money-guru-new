import { ReactNode } from "react";
import PageLayout from "../../PageLayout";

interface LearningModuleContainerProps {
  children: ReactNode;
  hasContentPadding?: boolean;
}

export const LearningModuleLayout = ({
  hasContentPadding,
  children,
}: LearningModuleContainerProps) => {
  return (
    <PageLayout
      navbarText={"Learning Module"}
      hasLocaleChange={false}
      hasShare={false}
      hasContentPadding={hasContentPadding}
    >
      {children}
    </PageLayout>
  );
};
