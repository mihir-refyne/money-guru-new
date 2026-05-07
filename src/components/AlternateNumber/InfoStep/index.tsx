import { Dispatch, SetStateAction, useState } from "react";
import Input from "@/components/Input";
import { isPhoneNumber } from "../types";
import styles from "./styles.module.css";
import useTranslation from "@/hooks/useTranslation";

interface InfoStepProps {
  enteredNumber: string;
  setEnteredNumber: Dispatch<SetStateAction<string>>;
}

export default function InfoStep({
  enteredNumber,
  setEnteredNumber,
}: InfoStepProps) {
  const { tWithoutTypeSafety: t } = useTranslation("common");
  const [error, setError] = useState<string>();

  return (
    <>
      <h2 className="text-heading text-semibold">
        {t("alternate_number_info_heading")}
      </h2>
      <p className={`text-body ${styles.infoStep__bodyText}`}>
        {t("cibil_alternate_number_info_desc")}
      </p>

      <div className={styles.infoStep__card}>
        <div className={styles.infoStep__inputWrapper}>
          <div className={styles.infoStep__inputField}>
            <Input
              type="tel"
              value={enteredNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setEnteredNumber(value);
                if (error) setError(undefined);
                if (value.length >= 10 && !isPhoneNumber(value)) {
                  setError(t("alternate_number_input_error"));
                }
              }}
              error={error}
              className={styles.infoStep__input}
              label={t("alternate_number_input_label")}
            />
          </div>
        </div>
      </div>
    </>
  );
}
