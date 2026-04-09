import Image from "next/image";
import EquifaxLogo from "@/images/equifax_logo.svg";
import CibilLogo from "@/images/cibil_logo.png";
import styles from "./CommonFooter.module.css";

export default function CommonFooter() {
  return (
    <div className={styles.CommonFooter}>
      <span className="clr-text-secondary text-caption mr-2">Powered By</span>
      <span className="text-caption mr-2">REFYNE FINANCE</span>
      <Image src={CibilLogo} alt="Cibil" width={50} height={20} />
    </div>
  );
}
