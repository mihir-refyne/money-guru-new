import { SolidFooterActionButton } from "@/components/CarleaseJourney/FooterActionButton";
import {
  CarLeaseAndLoanComparisonTable,
  parseCarLeaseUserFormParamValues,
} from "@/components/CarleaseJourney/SummaryComponents/ComparisonTable";
import { CARLEASE_JOURNEY_ROUTES } from "@/components/CarleaseJourney/constants";
import PageLayout from "@/components/PageLayout";
import { postCarleaseData } from "@/lib/carlease-journey";
import { getCoreServerErrorMessageFromFetcherError } from "@/lib/core-server";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

export default function SummaryPage() {
  const router = useRouter();
  const { userForm } = router.query;

  const carLeaseValues = useMemo(
    () => parseCarLeaseUserFormParamValues(userForm as string),
    [userForm]
  );

  const FooterActionButtons = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
      setIsLoading(true);
      try {
        const result = await postCarleaseData(carLeaseValues);
        toast.success("Summary details added successfully");
        if (result) router.push(CARLEASE_JOURNEY_ROUTES.CARLEASE_DETAIL_PAGE);
      } catch (error: any) {
        setIsLoading(false);
        const errorMessage = getCoreServerErrorMessageFromFetcherError(error);
        if (!errorMessage) return;
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: "16px 24px",
          marginTop: "auto",
          gap: "8px",
        }}
      >
        <SolidFooterActionButton
          label="Book Now"
          onClick={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    );
  };

  return (
    <PageLayout
      pageBackground="white"
      hasContentPadding={false}
      hasLocalButton={false}
      transparentNavbar={false}
      hasBackButton={true}
      footer={<FooterActionButtons />}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <SummaryHeaderSectionTextContent />
        <div
          style={{
            padding: "12px",
          }}
        >
          <CarLeaseAndLoanComparisonTable />
        </div>

        {/* <UserSavingSummaryDetailSection /> */}
      </div>
    </PageLayout>
  );
}

const SummaryHeaderSectionTextContent = () => {
  return (
    <h3
      style={{
        fontWeight: 600,
        fontSize: "20px",
        lineHeight: "28px",
        padding: "12px 24px",
      }}
    >
      Hey, let’s explore your benefits with{" "}
      <span
        style={{
          color: "var(--clr-brand-default)",
          borderBottom: "1px solid transparent",
          borderImage:
            "linear-gradient(270deg, rgba(94, 166, 245, 0.25) 0%, #5EA6F5 100%)",
          borderImageSlice: 1,
        }}
      >
        {" "}
        Refyne Car Lease!
      </span>
    </h3>
  );
};
