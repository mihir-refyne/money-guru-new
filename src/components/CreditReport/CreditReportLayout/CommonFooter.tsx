import Image from "next/image";
import EquifaxLogo from "@/images/equifax_logo.svg";
import styles from "./CommonFooter.module.css";

export default function CommonFooter() {
  return (
    <div className={styles.CommonFooter}>
      <span className="clr-text-secondary text-caption mr-2">Powered By</span>
      <Image src={EquifaxLogo} alt="Equifax" />
    </div>
  );
}
