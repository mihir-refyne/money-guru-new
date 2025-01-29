import useTranslation from "@/hooks/useTranslation";
import styles from "../../../pages/two-wheeler-loan/styles.module.css";
import { VehicleLoan } from "@/lib/two-wheeler-loan";
import { formatToInr } from "@/lib/utils";

export const SanctionedDetailsSection = ({
  vehicleLoan,
}: {
  vehicleLoan: VehicleLoan | null;
}) => {
  const { t } = useTranslation("common");

  return (
    <div>
      <p
        style={{
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: "600",
        }}
      >
        {t("application_sanctioned_details")}
      </p>
      <div
        className={styles.outer_wrapper}
        style={{
          flexDirection: "column",
        }}
      >
        <div
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
            {t("application_sanctioned_amount")}
          </p>
          <p
            style={{
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: "400",
              color: "#121212",
            }}
          >
            {formatToInr(vehicleLoan?.applicationApprovalDetails?.amount ?? 0)}
          </p>
        </div>
        <div
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
            {t("application_sanctioned_tenure")}
          </p>
          <p
            style={{
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: "400",
              color: "#121212",
            }}
          >
            {vehicleLoan?.applicationApprovalDetails?.tenure}{" "}
            {t("bottom_sheet_choose_tenure_item_month_text")}
          </p>
        </div>
        <div
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
            {t("application_sanctioned_interest_rate")}
          </p>
          <p
            style={{
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: "400",
              color: "#121212",
            }}
          >
            {vehicleLoan?.applicationApprovalDetails?.interestRate}%
          </p>
        </div>
      </div>
    </div>
  );
};
