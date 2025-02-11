import useTranslation from "@/hooks/useTranslation";
import styles from "../../../pages/two-wheeler-loan/styles.module.css";
import { LoanStatus, VehicleLoan } from "@/lib/two-wheeler-loan";
import { formatToInr } from "@/lib/utils";

export const SanctionedDetailsSection = ({
  vehicleLoan,
}: {
  vehicleLoan: VehicleLoan | null;
}) => {
  const { t } = useTranslation("common");
  const tenure = vehicleLoan?.applicationApprovalDetails?.tenure;
  const approvalDetails = vehicleLoan?.applicationApprovalDetails;

  const formatTenure = (tenure?: number) =>
    `${tenure} ${
      tenure === 1 ? "month" : t("bottom_sheet_choose_tenure_item_month_text")
    }`;

  const ApplicationSanctionedDetails = [
    {
      title: t("application_sanctioned_amount"),
      data: formatToInr(approvalDetails?.amount ?? 0),
    },
    { title: t("application_sanctioned_tenure"), data: formatTenure(tenure) },
    {
      title: t("application_sanctioned_interest_rate"),
      data: `${approvalDetails?.interestRate}%`,
    },
  ];

  const ApplicationDisbursedDetails = [
    {
      title: t("application_disbursed_amount"),
      data: formatToInr(approvalDetails?.amount ?? 0),
    },
    { title: t("application_sanctioned_tenure"), data: formatTenure(tenure) },
    {
      title: t("application_sanctioned_interest_rate"),
      data: `${approvalDetails?.interestRate}%`,
    },
  ];

  const isApproved = vehicleLoan?.status === LoanStatus.APPROVED;

  const ApplicationSectionData = isApproved
    ? ApplicationSanctionedDetails
    : ApplicationDisbursedDetails;

  const sectionTitle = isApproved
    ? t("application_sanctioned_details")
    : t("application_status_disbursed_details_title");

  return (
    <div>
      <p
        style={{
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: "600",
        }}
      >
        {sectionTitle}
      </p>
      <div
        className={styles.outer_wrapper}
        style={{
          flexDirection: "column",
        }}
      >
        {ApplicationSectionData.map((item, index) => {
          return (
            <div
              key={index}
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: "400",
                  color: "#9E9E9E",
                }}
              >
                {item.title}
              </p>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: "400",
                  color: "#121212",
                }}
              >
                {item.data}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
