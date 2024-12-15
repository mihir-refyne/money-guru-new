import PageLayout from "@/components/PageLayout";
import FincoachLandingPage from "../../components/Fincoach/index";

export default function FincoachPage() {
  return (
    <PageLayout
      hasContentPadding={false}
      hasLocalButton={false}
      navbarText="Financial Coach"
    >
      <FincoachLandingPage />
    </PageLayout>
  );
}
