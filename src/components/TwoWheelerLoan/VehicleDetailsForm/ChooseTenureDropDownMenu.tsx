import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import { useState } from "react";
import dropDownIcon from "../../../../public/assets/images/two-wheeler-loan/drop_down_icon.svg";
import styles from "./styles.module.css";
import TwoWheelerLoanConfigData from "../../../../data/two_wheeler_config.json";

export const ChooseTenureDropDownMenu = ({
  tenure,
  onClick,
}: {
  tenure: number;
  onClick: () => void;
}) => {
  const { t } = useTranslation("common");

  return (
    <div className={`${styles.input_container}`}>
      <p className={styles.input_field_label}>
        {t("bottom_sheet_choose_tenure_header")}
      </p>
      <div
        className={`${styles.input_field} ${styles.choose_tenure__text}`}
        onClick={onClick}
      >
        <p>
          {tenure} {t("bottom_sheet_choose_tenure_item_month_text")}
        </p>
        <Image src={dropDownIcon} alt="down arrow" />
      </div>
    </div>
  );
};

export const ChooseTenureDropDownList = ({
  value,
  onChange,
  onClose,
}: {
  value: number;
  onChange: (tenure: number) => void;
  onClose?: () => void;
}) => {
  const loanTenureData =
    TwoWheelerLoanConfigData.applicationDetailsData.tenures;
  const { t } = useTranslation("common");
  const [selectedTenure, setSelectedTenure] = useState<string>(
    value.toString()
  );

  const handleContinue = () => {
    onChange(Number(selectedTenure));
    onClose?.();
  };

  return (
    <div className={styles.choose_tenure__container}>
      <p className={styles.choose_tenure__header}>
        {t("bottom_sheet_choose_tenure_header")}
      </p>
      {loanTenureData.map((item, index) => {
        const isSelected = selectedTenure === item;
        return (
          <div
            key={item}
            className={`${styles.choose_tenure__item_wrapper}`}
            onClick={() => setSelectedTenure(item)}
          >
            <div
              className={`${styles.choose_tenure__item} ${
                isSelected && styles.choose_tenure__item__selected
              }`}
            >
              <p
                className={`${styles.choose_tenure__text} ${
                  isSelected && styles.choose_tenure__text__selected
                }`}
              >
                {item} {t("bottom_sheet_choose_tenure_item_month_text")}
              </p>
            </div>
          </div>
        );
      })}

      <button
        className={`btn-compact btn-primary btn ${styles.choose_tenure__continue_label}`}
        onClick={handleContinue}
      >
        {t("continue_footer_cta")}
      </button>
    </div>
  );
};
