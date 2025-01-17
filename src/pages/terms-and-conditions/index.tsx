import LoadingPage from "@/components/LoadingPage";
import PageLayout from "@/components/PageLayout";
import { TERMS_AND_CONDITIONS } from "@/components/TwoWheelerLoan/constants";
import { FooterButton } from "@/components/TwoWheelerLoan/FooterButton";
import useTranslation from "@/hooks/useTranslation";
import { useRouter } from "next/router";
import { useState } from "react";

export default function TwoWheelerLoan() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [isLoading, setIsLoading] = useState(true);

  return (
    <PageLayout
      hasContentPadding={true}
      hasLocalButton={false}
      transparentNavbar={false}
      hasBackButton={true}
      navbarBackground="transparent"
      navbarText="Terms & Conditions"
      footer={
        <FooterButton
          label={t("terms_conditions_footer_label")}
          isButtonDisabled={false}
          onClick={() => router.back()}
        />
      }
    >
      <div className="flex-1">
        {isLoading && <LoadingPage />}
        <iframe
          src={TERMS_AND_CONDITIONS}
          style={{
            border: "none",
            height: "calc(100vh - 160px)",
            width: "100%",
          }}
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </PageLayout>
  );
}
