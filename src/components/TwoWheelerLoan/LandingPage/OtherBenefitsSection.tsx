import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import styles from "./styles.module.css";
import CheckFilledIcon from "../../../../public/assets/images/two-wheeler-loan/checkbox_circle_fill.svg";

export const OtherBenefitsSection = () => {
  const { t } = useTranslation("common");
  const OtherBenefits = [
    t("two_wheeler_landing_page_other_benefits_text_1"),
    t("two_wheeler_landing_page_other_benefits_text_2"),
    t("two_wheeler_landing_page_other_benefits_text_3"),
    t("two_wheeler_landing_page_other_benefits_text_4"),
  ];

  return (
    <div className={styles.other_benefits_section}>
      <p className={`text-semibold ${styles.other_benefits_section__header}`}>
        {t("two_wheeler_landing_page_other_benefits")}
      </p>

      <div className={styles.other_benefits_section__box}>
        {OtherBenefits.map((item, index) => {
          return (
            <div
              className={`${styles.other_benefits_section__item}`}
              key={index}
            >
              <Image src={CheckFilledIcon} alt="check icon" />
              <p
                className={`text-regular ${styles.other_benefits_section__item__text}`}
              >
                {item}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
