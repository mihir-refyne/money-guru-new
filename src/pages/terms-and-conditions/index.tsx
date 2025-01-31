import { useRouter } from "next/router";
import { useState } from "react";
import LoadingPage from "@/components/LoadingPage";
import PageLayout from "@/components/PageLayout";
import { FooterButton } from "@/components/TwoWheelerLoan/FooterButton";
import useTranslation from "@/hooks/useTranslation";
import TwoWheelerLoanConfigData from "../../../data/two_wheeler_config.json";
import { isRefyneUrl } from "@/lib/utils";

export default function TermsAndConditions() {
  const router = useRouter();

  const routerParamTnC = router.query.tnc as unknown;
  const tncUrl = routerParamTnC as string;

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
          src={isRefyneUrl(tncUrl) ?? TwoWheelerLoanConfigData.termsConditions}
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
