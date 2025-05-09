import { useRouter } from "next/router";
import PageLayout from "@/components/PageLayout";
import { CARLEASE_JOURNEY_ROUTES } from "@/components/CarleaseJourney/constants";
import BGDottedLine from "../../../../public/assets/images/carlease-journey/bg-dotted-line.svg";
import Image from "next/image";
import { SolidFooterActionButton } from "@/components/CarleaseJourney/FooterActionButton";
import { ProcessType } from "@/lib/carlease-journey";
import CarGiftImage from "../../../../public/assets/images/carlease-journey/car_gift_icon.svg";

export default function NewCarAcquisitionProcessPage() {
  const router = useRouter();
  const { processType: processTypeRouteParam } = router.query;
  const processType = (processTypeRouteParam as ProcessType) ?? undefined;

  return (
    <PageLayout
      pageBackground="white"
      hasContentPadding={false}
      hasLocalButton={false}
      transparentNavbar={false}
      hasBackButton={true}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "24px",
          gap: "24px",
        }}
      >
        <HeaderSectionTextContent processType={processType} />
        <AcquisitionProcessStepsListView />
      </div>
    </PageLayout>
  );
}

const AcquisitionProcessStepsListView = () => {
  const VEHICLE_ACQUISITION_PROCESS_DATA = [
    "Identify your desired car",
    "Enter details in the Refyne App",
    "Verification and the tri-party agreement are assigned",
    "Lease commences, and CTC is restructured",
    "Employer pays the lease invoice to Refyne each month",
  ];
  const AcquisitionStepTile = ({
    stepNumber,
    stepTitle,
  }: {
    stepNumber: number;
    stepTitle: string;
  }) => {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          padding: "12px",
          gap: "12px",
          border: "1px solid var(--clr-border-enabled)",
          borderRadius: "4px",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          backgroundColor: "white",
        }}
      >
        <h1
          style={{
            fontWeight: 800,
            fontSize: "32px",
            lineHeight: "40px",
            color: "#B3B3B3",
            padding: "4px 12px",
          }}
        >
          {stepNumber}
        </h1>
        <p
          style={{
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "20px",
            color: "#121212",
          }}
        >
          {stepTitle}
        </p>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <Image
        src={BGDottedLine}
        alt="bg line"
        style={{
          left: "30px",
          position: "absolute",
          zIndex: 0,
          height: "100%",
        }}
      />

      {VEHICLE_ACQUISITION_PROCESS_DATA.map((item, index) => (
        <AcquisitionStepTile
          key={index}
          stepNumber={index + 1}
          stepTitle={item}
        />
      ))}
    </div>
  );
};

const HeaderSectionTextContent = ({
  processType,
}: {
  processType: ProcessType;
}) => {
  const title = processType === ProcessType.NEW_CAR ? "New Car" : "Old Car";
  const subHeading = processType === ProcessType.NEW_CAR ? "new" : "old";

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "end",
        justifyContent: "end",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <h3
          style={{
            fontWeight: 600,
            fontSize: "20px",
            // lineHeight: "28px",
            color: "#0057B7",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontWeight: 600,
            fontSize: "20px",
            lineHeight: "28px",
          }}
        >
          Acquisition Guide
        </p>
        <p
          style={{
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: "16px",
            color: "var(--clr-pure-grey)",
          }}
        >
          Follow the complete guide to easily acquire your {subHeading} car.
        </p>
      </div>
      <Image src={CarGiftImage} alt="car gift" />
    </div>
  );
};

const FooterActionButtons = () => {
  const router = useRouter();

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
        label="Support"
        onClick={() => router.push(CARLEASE_JOURNEY_ROUTES.TAX_BENEFITS_FORM)}
      />
    </div>
  );
};
