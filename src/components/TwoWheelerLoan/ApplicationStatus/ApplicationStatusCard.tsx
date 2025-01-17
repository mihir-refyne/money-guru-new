import {
  ApprovalDetails,
  LoanStatus,
  VehicleLoan,
} from "@/lib/two-wheeler-loan";
import styles from "../../../pages/two-wheeler-loan/styles.module.css";
import pendingStatusIcon from "../../../../public/assets/images/two-wheeler-loan/pending_status_icon.svg";
import failedStatusIcon from "../../../../public/assets/images/two-wheeler-loan/close_circle_fill.svg";
import successStatusIcon from "../../../../public/assets/images/two-wheeler-loan/success_status_icon.svg";
import Image from "next/image";
import applicationStatusStyles from "./styles.module.css";
import { formatDateWithYear } from "@/lib/utils";

export const ApplicationStatusCard = ({
  vehicleLoan,
}: {
  vehicleLoan?: VehicleLoan | null;
}) => {
  const statusMapping: Record<string, any> = {
    [LoanStatus.APPROVED]: {
      icon: successStatusIcon,

      title: "Application Processed",
      titleClassStatusStyle:
        applicationStatusStyles.application_status_card__title_success,
      description: "",
    },
    [LoanStatus.PENDING]: {
      icon: pendingStatusIcon,
      title: "Application under review",
      titleClassStatusStyle:
        applicationStatusStyles.application_status_card__title_pending,
      description:
        "Your application is under review. A representative from our loan partner JANA will reach out to you.",
    },
    [LoanStatus.REJECTED]: {
      icon: failedStatusIcon,
      title: "Application Rejected",
      titleClassStatusStyle:
        applicationStatusStyles.application_status_card__title_error,
      description:
        "Your credit score is below the required minimum of 600. Please improve your score to apply again.",
    },
  };

  const status = vehicleLoan?.status ?? LoanStatus.INITIATED;

  const { icon, titleClassStatusStyle, description, title } =
    statusMapping[status];

  return (
    <div className={styles.outer_wrapper}>
      <Image src={icon} alt="application status" />
      <div>
        <div
          className={`${
            applicationStatusStyles.application_status_card_header__wrapper
          } ${
            status === LoanStatus.APPROVED &&
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
            ₹ {vehicleLoan?.approvalDetails?.approvedAmount}
          </p>
          <p className={applicationStatusStyles.application_status_card__date}>
            {formatDateWithYear(vehicleLoan?.createdAt ?? "")}
          </p>
        </div>{" "}
        <p
          className={
            applicationStatusStyles.application_status_card__description
          }
        >
          {description}
        </p>
      </div>
    </div>
  );
};
