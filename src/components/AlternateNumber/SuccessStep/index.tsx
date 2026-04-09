import Image from "next/image";
import SuccessImage from "@/images/check_green.svg";
import styles from "./styles.module.css";

export default function SuccessStep() {
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
        Number Verified Successfully
      </h3>
      <p className={`text-body ${styles.successStep__bodyText}`}>
        Your alternate phone number has been verified successfully
      </p>
    </div>
  );
}
