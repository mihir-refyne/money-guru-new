import PageLayout from "@/components/PageLayout";
import Image from "next/image";
import useTranslation from "@/hooks/useTranslation";
import BikeImage from "../../../public/assets/images/two-wheeler-loan/bike_image.svg";
import GiftBoxIcon from "../../../public/assets/images/two-wheeler-loan/gift_box_icon.svg";
import { FooterButton } from "@/components/TwoWheelerLoan/FooterButton";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { fetchAllLoans } from "@/lib/two-wheeler-loan";
import useFetcher from "@/hooks/useFetcher";
import LoadingPage from "@/components/LoadingPage";
import toast from "react-hot-toast";
import { getCoreServerErrorMessageFromFetcherError } from "@/lib/core-server";
import {
  TopSectionHeaderBanner,
  TopSectionHeaderText,
  TopSectionKeyBenefitsGridContainer,
} from "@/components/TwoWheelerLoan/LandingPage/TopSectionHeader";
import { FAQSection } from "@/components/TwoWheelerLoan/LandingPage/FAQSection";
import { OtherBenefitsSection } from "@/components/TwoWheelerLoan/LandingPage/OtherBenfitsSection";
import { getValueFromMetadata } from "@/lib/core/user-metadata";

export default function TwoWheelerLoan() {
  const router = useRouter();
  const { isLoading, data: loansData, error } = useFetcher(fetchAllLoans);
  const userToken = getValueFromMetadata("idToken");

  useEffect(() => {
    const checkLoanStatus = async () => {
      try {
        const loanData = loansData && loansData[0];

        if (loanData?.status) {
          router.replace(`two-wheeler-loan/application-status`);
        }
      } catch (error: any) {
        const errorMessage = getCoreServerErrorMessageFromFetcherError(error);
        if (!errorMessage) return;
        toast.error(errorMessage);
      }
    };

    !isLoading && loansData && checkLoanStatus();
  }, [isLoading, loansData, userToken]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <PageLayout
      pageBackground={"white"}
      hasContentPadding={false}
      hasLocalButton={false}
      transparentNavbar={true}
      hasBackButton={true}
      navbarBackground={"transparent"}
      navbarText="Two-Wheeler Loan"
      footer={<TwoWheelerPageFooter />}
    >
      <div>
        <div
          style={{
            backgroundImage:
              "linear-gradient(181.68deg, #FFEAC9 -121.9%, #FFFFFF 131.67%)",
          }}
        >
          <div
            style={{
              paddingTop: "80px",
              paddingBottom: "100px",
            }}
            className="flex-center container"
          >
            <TopSectionHeaderText />
            <TopSectionHeaderBanner />
            <TopSectionKeyBenefitsGridContainer />
          </div>
        </div>
        <Image
          priority={true}
          src={BikeImage}
          alt="Bike Image"
          style={{
            position: "relative",
            height: "100%",
            transform: "translateY(-45%)",
            width: "100%",
            padding: "20px",
            marginBottom: "-30%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
        <div
          style={{
            backgroundColor: "white",
          }}
        >
          <OtherBenefitsSection />
          <FAQSection />
        </div>
      </div>
    </PageLayout>
  );
}

export const TwoWheelerPageFooter = () => {
  const { t } = useTranslation("common");
  const router = useRouter();

  return (
    <div
      style={{
        paddingTop: "32px",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--clr-icon-accent-success)",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: "8px",
          padding: "8px 12px",
        }}
      >
        <Image src={GiftBoxIcon} alt="gift box" />
        <p
          style={{
            color: "white",
            fontSize: "12px",
            fontWeight: "600",
            lineHeight: "16px",
          }}
        >
          {t("loan_get_cash_back_text")}
        </p>
      </div>

      <FooterButton
        isButtonDisabled={false}
        label={t("continue_footer_cta")}
        onClick={() => {
          router.push(`${router.pathname}/confirm-details`);
        }}
      />
    </div>
  );
};
