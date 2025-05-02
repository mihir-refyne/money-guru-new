import { useRouter } from "next/router";
import PageLayout from "@/components/PageLayout";
import Image from "next/image";
import MoneyBagIcon from "../../../../public/assets/images/carlease-journey/money-bag-icon.svg";
import DriverIcon from "../../../../public/assets/images/carlease-journey/driver-icon.svg";
import FuelIcon from "../../../../public/assets/images/carlease-journey/fuel-icon.svg";
import CarMaintenance from "../../../../public/assets/images/carlease-journey/car-maintenance-icon.svg";
import RightArrowSeparator from "../../../../public/assets/images/carlease-journey/right-arrow-separator.svg";
import LeftArrowSeparator from "../../../../public/assets/images/carlease-journey/left-arrow-separator.svg";
import LighterArrowSeparator from "../../../../public/assets/images/carlease-journey/arrow-separator-lighter.svg";
import InsuranceBenefitIcon from "../../../../public/assets/images/carlease-journey/insurance-benefit-icon.svg";
import LeasingOptionIcon from "../../../../public/assets/images/carlease-journey/leasing-option-benefit-icon.svg";
import InterestRateIcon from "../../../../public/assets/images/carlease-journey/interest-rate-benefit-icon.svg";
import MileageIcon from "../../../../public/assets/images/carlease-journey/mileage-benefit-icon.svg";
import ExitOptionIcon from "../../../../public/assets/images/carlease-journey/exit-option-icon.svg";
import EmployeeEducation from "../../../../public/assets/images/carlease-journey/employee-education.svg";
import CheckIcon from "../../../../public/assets/images/carlease-journey/check-icon.svg";
import { CARLEASE_JOURNEY_ROUTES } from "@/components/CarleaseJourney/constants";
import {
  OutlineFooterActionButton,
  SolidFooterActionButton,
} from "@/components/CarleaseJourney/FooterActionButton";
import { ProcessType } from "@/lib/carlease-journey";

export default function CarleaseLandingPage() {
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
        }}
      >
        <HeaderSectionHeadingText />
        {/* <TaxBenefitsSection /> */}
        <RefyneCarLeaseBenefits />
        <AdditionalBenefitsAtNoCost />
        <CheckVehicleAcquisitionPosition />
      </div>
    </PageLayout>
  );
}
const HeaderSectionHeadingText = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <p
        style={{
          textAlign: "left",
          fontWeight: 600,
          fontSize: "20px",
          lineHeight: "28px",
        }}
      >
        Get benefits on{" "}
        <span
          style={{
            color: "var(--clr-brand-default)",
          }}
        >
          your dream car{" "}
        </span>
        with Refyne car lease policy!
      </p>
    </div>
  );
};

const TaxBenefitsSection = () => {
  const TAX_BENEFITS_DATA = [
    { icon: MoneyBagIcon, title: "Benefit on monthly EMI" },
    { icon: DriverIcon, title: "Benefit on Driver Salary" },
    { icon: FuelIcon, title: "Exclusive Fuel Benefits" },
    { icon: CarMaintenance, title: "Benefit on Maintenance" },
  ];

  return (
    <div
      style={{
        paddingTop: "24px",
        paddingBottom: "24px",
        display: "flex",
        alignItems: "center",
        gap: "24px",
        flexDirection: "column",
        backgroundColor: "var(--clr-bg-primary-lighter)",
      }}
    >
      <div
        style={{
          gap: "4px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {" "}
        <Image src={RightArrowSeparator} alt="right arrow" />
        <p
          style={{
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "20px",
            color: "#121212",
          }}
        >
          TAX BENEFITS
        </p>
        <Image src={LeftArrowSeparator} alt="right arrow" />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
          margin: "0 12px",
        }}
      >
        {TAX_BENEFITS_DATA.map((item, index) => {
          return (
            <div
              key={index}
              style={{
                gap: "8px",
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                border: "0.5px solid #5EA6F5",
                padding: "12px",
                borderRadius: "4px",
              }}
            >
              <Image src={item.icon} alt="" />
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  lineHeight: "20px",
                }}
              >
                {item.title}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RefyneCarLeaseBenefits = () => {
  const REFYNE_CAR_LEASE_BENEFITS_DATA = [
    { icon: LeasingOptionIcon, title: "Diverse Leasing options" },
    { icon: MileageIcon, title: "Unlimited mileage" },
    { icon: InsuranceBenefitIcon, title: "Comprehensive insurance" },
    { icon: InterestRateIcon, title: "Interest Rate Flexibility" },
    { icon: ExitOptionIcon, title: "Flexible Exit Options" },
    { icon: EmployeeEducation, title: "Employee Education" },
  ];

  return (
    <div
      style={{
        paddingTop: "24px",
        paddingBottom: "24px",
        display: "flex",
        alignItems: "center",
        gap: "24px",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          gap: "4px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {" "}
        <Image src={LighterArrowSeparator} alt="right arrow" />
        <p
          style={{
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "20px",
            color: "#121212",
            textAlign: "center",
          }}
        >
          REFYNE CAR LEASE BENEFITS
        </p>
        <Image
          src={LighterArrowSeparator}
          alt="left arrow"
          style={{
            transform: "rotate(180deg)",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          //   width: "calc(100% - 50px)",
          margin: "0 12px",
        }}
      >
        {REFYNE_CAR_LEASE_BENEFITS_DATA.map((item, index) => {
          return (
            <div
              key={index}
              style={{
                gap: "8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  backgroundColor: "var(--clr-border-enabled)",
                  borderRadius: "100%",
                  padding: "10px",
                }}
              >
                {" "}
                <Image src={item.icon} alt="" />
              </div>

              <h3
                style={{
                  color: "#121212",
                  fontSize: "12px",
                  fontWeight: 400,
                  textAlign: "center",
                  lineHeight: "16px",
                }}
              >
                {item.title}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AdditionalBenefitsAtNoCost = () => {
  const ADDITIONAL_BENEFITS_AT_NO_COST_DATA = [
    "A dedicated account manager",
    "24/7 Roadside Assistance",
    "Car sourcing help",
    "Insurance claim support",
    "Complete RTO documentation",
    "Vehicle Resale Support",
  ];

  return (
    <div
      style={{
        paddingTop: "24px",
        paddingBottom: "24px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          gap: "4px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {" "}
        <Image src={LighterArrowSeparator} alt="right arrow" />
        <p
          style={{
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "20px",
            color: "#121212",
            textAlign: "center",
          }}
        >
          ADDITIONAL BENEFITS AT NO COST
        </p>
        <Image
          src={LighterArrowSeparator}
          alt="left arrow"
          style={{
            transform: "rotate(180deg)",
          }}
        />
      </div>

      <div style={{ width: "100%", padding: "24px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "12px",
            borderRadius: "4px",
            gap: "12px",
            border: "0.5px solid var(--clr-border-enabled)",
          }}
        >
          {ADDITIONAL_BENEFITS_AT_NO_COST_DATA.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  padding: "8px",
                  display: "flex",
                  borderBottom:
                    index === ADDITIONAL_BENEFITS_AT_NO_COST_DATA.length - 1
                      ? "none"
                      : "0.5px solid var(--clr-border-enabled)",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <Image src={CheckIcon} alt="check icon" />
                <p>{item} </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CheckVehicleAcquisitionPosition = () => {
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
        padding: "16px 24px",
        backgroundColor: "var(--clr-bg-primary-lighter)",
        marginBottom: "80px",
      }}
    >
      <p
        style={{
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: "24px",
          textAlign: "center",
        }}
      >
        Check Vehicle Acquisition Process
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "24px",
          width: "100%",
        }}
      >
        {" "}
        <button
          style={{
            width: "100%",
            border: "1px solid var(--clr-icon-primary-light)",
            borderRadius: "8px",
            padding: "8px",
            backgroundColor: "white",
          }}
          onClick={() =>
            router.push(
              `${CARLEASE_JOURNEY_ROUTES.CARLEASE_ACQUISITION_PROCESS}?processType=${ProcessType.NEW_CAR}`
            )
          }
        >
          <p
            style={{
              padding: "8px",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "20px",
            }}
          >
            New Car
          </p>
        </button>
        <button
          style={{
            width: "100%",
            border: "1px solid var(--clr-icon-primary-light)",
            borderRadius: "8px",
            padding: "8px",
            backgroundColor: "white",
          }}
        >
          <p
            style={{
              padding: "8px",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "20px",
            }}
            onClick={() =>
              router.push(
                `${CARLEASE_JOURNEY_ROUTES.CARLEASE_ACQUISITION_PROCESS}?processType=${ProcessType.OLD_CAR}`
              )
            }
          >
            Old Car
          </p>
        </button>
      </div>
    </div>
  );
};

const FooterActionButtons = () => {
  const router = useRouter();
  return (
    <div
      style={{
        borderTop: "1px solid var(--clr-border-enabled)",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: "16px 24px",
        marginTop: "auto",
        gap: "8px",
      }}
    >
      <SolidFooterActionButton
        label="Calculate your benefits"
        onClick={() => router.push(CARLEASE_JOURNEY_ROUTES.TAX_BENEFITS_FORM)}
      />

      <OutlineFooterActionButton
        label="Choose your car"
        onClick={() => router.push(CARLEASE_JOURNEY_ROUTES.USER_DETAIL_FORM)}
      />
    </div>
  );
};
