import Image from "next/image";
import SuccessImage from "@/images/check_green.svg";
import styles from "./styles.module.css";
import useTranslation from "@/hooks/useTranslation";

export default function SuccessStep() {
  const { tWithoutTypeSafety: t } = useTranslation("common");
  
  return (
    <div className={styles.successStep__container}>
      <Image
        src={SuccessImage}
        alt="Success"
        className={styles.successStep__image}
        width={104}
        height={104}
      />
      <h3 className={`text-heading text-semibold ${styles.successStep__heading}`}>
        {t("alternate_number_success_heading")}
      </h3>
      <p className={`text-body ${styles.successStep__bodyText}`}>
        {t("alternate_number_success_description")}
      </p>
    </div>
  );
}
