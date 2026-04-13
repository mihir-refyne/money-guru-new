import Image from "next/image";
import EquifaxLogo from "@/images/equifax_logo.svg";
import CibilLogo from "@/images/cibil_logo.png";
import styles from "./CommonFooter.module.css";
import { CreditBureauVendor } from "@/lib/credit-report";

interface CommonFooterProps {
  vendor?: CreditBureauVendor;
  lender?: string;
}

export default function CommonFooter({ vendor, lender }: CommonFooterProps) {
  // Do not render if both vendor and lender are not available
  if (!vendor || !lender) {
    return null;
  }

  const formatLenderName = (lenderName: string) => {
    return lenderName.replace(/_/g, " ");
  };

  const renderVendorLogo = () => {
    switch (vendor) {
      case CreditBureauVendor.CIBIL:
        return <Image src={CibilLogo} alt="CIBIL" width={50} height={20} />;
      case CreditBureauVendor.EXPERIAN:
        // TODO: Replace with actual Experian logo when available. Using placeholder for now.
        return (
          <Image
            src="https://via.placeholder.com/100x30?text=EXPERIAN"
            alt="Experian"
            width={100}
            height={30}
          />
        );
      case CreditBureauVendor.EQUIFAX:
        return <Image src={EquifaxLogo} alt="Equifax" width={50} height={20} />;
      default:
        return <Image src={EquifaxLogo} alt="Equifax" width={50} height={20} />;
    }
  };

  return (
    <div className={styles.CommonFooter}>
      <span className="clr-text-secondary text-caption mr-2">Powered By</span>
      <span className="text-caption mr-2">{formatLenderName(lender)}</span>
      {renderVendorLogo()}
    </div>
  );
}
