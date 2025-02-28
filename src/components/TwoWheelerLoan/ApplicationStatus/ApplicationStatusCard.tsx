import { LoanStatus, VehicleLoan } from "@/lib/two-wheeler-loan";
import styles from "../../../pages/two-wheeler-loan/styles.module.css";
import pendingStatusIcon from "../../../../public/assets/images/two-wheeler-loan/pending_status_icon.svg";
import failedStatusIcon from "../../../../public/assets/images/two-wheeler-loan/close_circle_fill.svg";
import successStatusIcon from "../../../../public/assets/images/two-wheeler-loan/success_status_icon.svg";
import Image from "next/image";
import applicationStatusStyles from "./styles.module.css";
import { formatDateWithYear, formatToInr } from "@/lib/utils";
import useTranslation from "@/hooks/useTranslation";

export const ApplicationStatusCard = ({
  vehicleLoan,
}: {
  vehicleLoan?: VehicleLoan | null;
}) => {
  const { t } = useTranslation("common");

  const vehicleLoanStatusLog =
    vehicleLoan?.statusLog &&
    vehicleLoan.statusLog[vehicleLoan.statusLog.length - 1];

  const APPLICATION_STATUS_DATA: Record<string, any> = {
    [LoanStatus.INITIATED]: {
      icon: pendingStatusIcon,
      title: t("application_status_initiated_text"),
      titleClassStatusStyle:
        applicationStatusStyles.application_status_card__title_pending,
      description: t("application_status_initiated_description_text"),
      amount: formatToInr(vehicleLoan?.applicationDetails?.amount ?? 0),
    },
    [LoanStatus.APPROVED]: {
      icon: successStatusIcon,
      title: t("application_status_approved_text"),
      titleClassStatusStyle:
        applicationStatusStyles.application_status_card__title_success,
      description: "",
      amount: formatToInr(vehicleLoan?.applicationApprovalDetails?.amount ?? 0),
    },
    [LoanStatus.REJECTED]: {
      icon: failedStatusIcon,
      title: t("application_status_rejected_text"),
      titleClassStatusStyle:
        applicationStatusStyles.application_status_card__title_error,
      amount: formatToInr(vehicleLoan?.applicationDetails?.amount ?? 0),
      description: vehicleLoanStatusLog?.comment,
    },
    [LoanStatus.DISBURSED]: {
      icon: successStatusIcon,
      title: t("application_status_disbursed_text"),
      titleClassStatusStyle:
        applicationStatusStyles.application_status_card__title_success,
      amount: formatToInr(
        vehicleLoan?.applicationDisbursalDetails?.amount ?? 0
      ),
      description: "",
    },
  };

  const status = vehicleLoan?.status ?? LoanStatus.INITIATED;
  const { icon, titleClassStatusStyle, description, title, amount } =
    APPLICATION_STATUS_DATA[status];

  const applicationStatusDateStamp = formatDateWithYear(
    vehicleLoanStatusLog?.createdAt ?? ""
  );

  return (
    <div className={styles.outer_wrapper}>
      <Image src={icon} alt="application status" />
      <div>
        <div
          className={`${
            applicationStatusStyles.application_status_card_header__wrapper
          } ${
            !description &&
            applicationStatusStyles.application_status_card_header__wrapper_border_none
          }`}
        >
          <p
            className={`${applicationStatusStyles.application_status_card__title} ${titleClassStatusStyle}`}
          >
            {title}
          </p>
          <p
            className={applicationStatusStyles.application_status_card__amount}
          >
            {amount}
          </p>
          <p className={applicationStatusStyles.application_status_card__date}>
            {applicationStatusDateStamp}
          </p>
        </div>
        {description && (
          <p
            className={
              applicationStatusStyles.application_status_card__description
            }
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
