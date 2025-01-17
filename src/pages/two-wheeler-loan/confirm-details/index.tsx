import PageLayout from "@/components/PageLayout";
import { InputContainer } from "@/components/TwoWheelerLoan/InputContainer";
import useTranslation from "@/hooks/useTranslation";
import styles from "../../two-wheeler-loan/styles.module.css";
import { FooterButton } from "@/components/TwoWheelerLoan/FooterButton";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useFetcher from "@/hooks/useFetcher";
import {
  fetchPincodeServiceability,
  ServiceabilityResponse,
} from "@/lib/two-wheeler-loan";
import { getCoreServerErrorMessageFromFetcherError } from "@/lib/core-server";

interface PincodeState {
  value: string;
  error?: string;
  data: ServiceabilityResponse | null;
}

export default function ConfirmPincodeDetails() {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [state, setState] = useState<PincodeState>({
    value: "",
    error: undefined,
    data: null,
  });

  const { isLoading, data, error, refetch } = useFetcher(() =>
    fetchPincodeServiceability({ pincode: state.value })
  );

  const handlePincodeChange = (value: string) => {
    setState({
      value,
      error: undefined,
      data: null,
    });
  };

  useEffect(() => {
    if (state.value.length === 6 && !isLoading) {
      refetch();
    }
  }, [state.value, isLoading]);

  useEffect(() => {
    if (error) {
      setState((prev) => ({
        ...prev,
        error: getCoreServerErrorMessageFromFetcherError(error),
        data: null,
      }));
    } else if (data) {
      if (!data.serviceable) {
        setState((prev) => ({
          ...prev,
          error: "This pincode is not serviceable",
          data: null,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: undefined,
          data,
        }));
      }
    }
  }, [data, error]);

  // Get location text for success state
  const getLocationText = () => {
    const metadata = state.data?.pincodeMetadata;
    return metadata ? `${metadata.city}, ${metadata.state}` : undefined;
  };

  // Handle continue button click
  const handleContinue = () => {
    if (state.value.length < 1) {
      setState((prev) => ({
        ...prev,
        error: "This field is mandatory",
      }));
      return;
    }
    router.push(`/two-wheeler-loan/vehicle-details`);
  };

  // Check if pincode is valid and serviceable
  const isPincodeValid = state.data?.serviceable && !state.error;

  return (
    <PageLayout
      pageBackground={"var(--clr-background-surface)"}
      hasContentPadding={true}
      hasLocalButton={false}
      hasBackButton={true}
      navbarBackground={"transparent"}
      navbarText="Confirm Pincode"
      footer={
        <FooterButton
          isButtonDisabled={!isPincodeValid}
          label={t("continue_footer_cta")}
          onClick={handleContinue}
        />
      }
    >
      <div className={styles.pincode_container}>
        <div className={styles.pincode_header_wrapper}>
          <h2 className={styles.pincode_title}>{t("confirm_your_pincode")}</h2>
          <h4 className={styles.pincode_subtitle}>
            {t("verify_pincode_sub_header_text")}
          </h4>
        </div>

        <InputContainer
          maxLength={6}
          inputFieldType="number"
          value={state.value}
          errorMessage={state.error}
          hasSuccess={isPincodeValid}
          successResponse={getLocationText()}
          hasError={!!state.error && !state.data}
          label={t("enter_pincode_input_label")}
          onChange={(e) => handlePincodeChange(e.target.value)}
        />
      </div>
    </PageLayout>
  );
}
// import PageLayout from "@/components/PageLayout";
// import { InputContainer } from "@/components/TwoWheelerLoan/InputContainer";
// import useTranslation from "@/hooks/useTranslation";
// import styles from "../../two-wheeler-loan/styles.module.css";
// import { FooterButton } from "@/components/TwoWheelerLoan/FooterButton";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import useFetcher from "@/hooks/useFetcher";
// import {
//   fetchPincodeServiceability,
//   ServiceabilityResponse,
// } from "@/lib/two-wheeler-loan";
// import { getCoreServerErrorMessageFromFetcherError } from "@/lib/core-server";

// export default function ConfirmPincodeDetails() {
//   const { t } = useTranslation("common");
//   const router = useRouter();
//   const [pincode, setPincode] = useState("");
//   const [validationMessage, setValidationMessage] = useState<
//     string | undefined
//   >();

//   const [pincodeServiceabilityData, setPincodeServiceabilityData] =
//     useState<ServiceabilityResponse | null>();

//   const { isLoading, data, error, refetch } = useFetcher(() =>
//     fetchPincodeServiceability({ pincode })
//   );

//   useEffect(() => {
//     if (pincode.length === 6) {
//       refetch();
//       if (error && !data) {
//         console.log("THIS IS SET 1st one");
//         setPincodeServiceabilityData(null);
//         setValidationMessage(getCoreServerErrorMessageFromFetcherError(error));
//       } else if (data && !error) {
//         if (!data.serviceable) {
//           setValidationMessage("This pincode is not serviceable");
//           return;
//         }
//         setValidationMessage("");
//         setPincodeServiceabilityData(data);
//       }
//     }
//   }, [pincode, error, data]);

//   return (
//     <PageLayout
//       pageBackground={"var(--clr-background-surface)"}
//       hasContentPadding={true}
//       hasLocalButton={false}
//       hasBackButton={true}
//       navbarBackground={"transparent"}
//       navbarText="Confirm Pincode"
//       footer={
//         <FooterButton
//           isButtonDisabled={!!validationMessage || !!data?.serviceable}
//           label={t("continue_footer_cta")}
//           onClick={() => {
//             if (pincode.length < 1) {
//               setValidationMessage("This field is mandatory");
//               return;
//             }
//             router.push(`/two-wheeler-loan/vehicle-details`);
//           }}
//         />
//       }
//     >
//       <div className={styles.pincode_container}>
//         <div className={styles.pincode_header_wrapper}>
//           <h2 className={styles.pincode_title}>{t("confirm_your_pincode")}</h2>
//           <h4 className={styles.pincode_subtitle}>
//             {t("verify_pincode_sub_header_text")}
//           </h4>
//         </div>

//         <InputContainer
//           maxLength={6}
//           inputFieldType="number"
//           value={pincode}
//           errorMessage={validationMessage}
//           hasSuccess={
//             !validationMessage && !!pincodeServiceabilityData?.pincodeMetadata
//           }
//           successResponse={
//             pincodeServiceabilityData?.pincodeMetadata &&
//             `${pincodeServiceabilityData?.pincodeMetadata.city}, ${pincodeServiceabilityData?.pincodeMetadata.state}`
//           }
//           hasError={!!validationMessage}
//           label={t("enter_pincode_input_label")}
//           onChange={(e) => {
//             setPincodeServiceabilityData(null);
//             setValidationMessage("");
//             setPincode(e.target.value);
//           }}
//         />
//       </div>
//     </PageLayout>
//   );
// }
