import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import JanaSmallBankIcon from "../../../../public/assets/images/two-wheeler-loan/jana_small_bank_icon.svg";
import RefyneLogo from "../../../../public/assets/images/two-wheeler-loan/refyne_logo_with_name.svg";
import RupeeIcon from "../../../../public/assets/images/two-wheeler-loan/rupee_icon.svg";
import PercentIcon from "../../../../public/assets/images/two-wheeler-loan/percent_icon.svg";
import CheckIcon from "../../../../public/assets/images/two-wheeler-loan/check_icon.svg";
import styles from "./styles.module.css";

export const TopSectionHeaderText = () => {
  const { t } = useTranslation("common");
  return (
    <div className={styles.top_section_header}>
      <h2 className={`text-medium ${styles.top_section_header__subtitle}`}>
        {t("bike_loan_label")}
      </h2>
      <h1 className={styles.top_section_header__title}>
        {t("bike_loan_header")}
      </h1>
    </div>
  );
};

export const TopSectionHeaderBanner = () => {
  return (
    <div className={styles.top_section_banner}>
      <div className={styles.top_section_banner__logo_container}>
        <Image src={RefyneLogo} alt="Refyne Logo" />
      </div>
      <p
        style={{
          fontSize: "28.29px",
          lineHeight: "20.2px",
        }}
      >
        🤝🏽
      </p>
      <div
        className={`${styles.top_section_banner__logo_container} ${styles.top_section_banner__logo_container__small}`}
      >
        <Image src={JanaSmallBankIcon} alt="Jana Small Bank" />
      </div>
    </div>
  );
};

export const TopSectionKeyBenefitsGridContainer = () => {
  const { t } = useTranslation("common");

  const KeyBenefits = [
    { icon: CheckIcon, text: t("key_benefit_text_1"), value: "8.99%" },
    { icon: RupeeIcon, text: t("key_benefit_text_2"), value: "₹3,527" },
    { icon: PercentIcon, text: t("key_benefit_text_3"), value: "95%" },
  ];
  return (
    <div className={styles.top_section_key_benefits}>
      <p className={`text-semibold ${styles.top_section_key_benefits__header}`}>
        {t("key_benefit")}
      </p>

      {/* Grid Container */}
      <div className={`${styles.top_section_key_benefits__grid}`}>
        {/* Grid Items */}
        {KeyBenefits.map((item, index) => (
          <div key={index} className={styles.top_section_key_benefits__item}>
            <Image src={item.icon} alt={"icon"} />
            <p
              className={`${styles.top_section_key_benefits__item__text} text-regular`}
            >
              {item.text}
            </p>
            <p
              style={{
                fontWeight: "700",
                fontSize: "16px",
                lineHeight: "14px",
              }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
