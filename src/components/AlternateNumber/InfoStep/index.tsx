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
              placeholder={t("alternate_number_input_placeholder")}
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

// export default function InfoStep({
//   enteredNumber,
//   setEnteredNumber,
// }: InfoStepProps) {
//   const [error, setError] = useState<string>();
//   // const isPhoneNumber = isPhoneNumber(enteredNumber);

//   return (
//     <>
//       <h2 className="text-heading text-semibold">
//         Enter number that’s linked to your bank
//       </h2>
//       <p className={`text-body ${styles.infoStep__bodyText}`}>
//         We will send an OTP to verify your number
//       </p>

//       <div className={styles.infoStep__card}>
//         <div className={styles.infoStep__inputWrapper}>
//           <div className={styles.infoStep__inputField}>
//             <Input
//               type="tel"
//               value={enteredNumber}
//               onChange={(e) => {
//                 const value = e.target.value.replace(/\D/g, "").slice(0, 10);
//                 setEnteredNumber(value);
//                 if (error) setError(undefined);
//                 if (value.length >= 10 && !isPhoneNumber(value)) {
//                   setError("Please enter a valid 10 digit phone number");
//                 }
//               }}
//               placeholder="Enter 10 digit phone number"
//               error={error}
//               className={styles.infoStep__input}
//               label="Enter Mobile Number"
//             />

//             {/* <span className={styles.infoStep__suffixIcon}>
//               <CheckCircle size={20} weight="fill" />
//             </span> */}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
