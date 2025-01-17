import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PageLayout from "@/components/PageLayout";
import { InputContainer } from "@/components/TwoWheelerLoan/InputContainer";
import { FooterButton } from "@/components/TwoWheelerLoan/FooterButton";
import useTranslation from "@/hooks/useTranslation";
import {
  fetchPincodeServiceability,
  ServiceabilityResponse,
} from "@/lib/two-wheeler-loan";
import { getCoreServerErrorMessageFromFetcherError } from "@/lib/core-server";
import styles from "../../two-wheeler-loan/styles.module.css";
import { TwoWheelerRoutes } from "@/components/TwoWheelerLoan/constants";

interface PincodeState {
  value: string;
  error?: string;
  data: ServiceabilityResponse | null;
  isLoading: boolean;
}

export default function ConfirmPincodeDetails() {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [state, setState] = useState<PincodeState>({
    value: "",
    error: undefined,
    data: null,
    isLoading: false,
  });

  const handlePincodeChange = (value: string) => {
    setState({
      value,
      error: undefined,
      data: null,
      isLoading: false,
    });
  };

  const fetchServiceability = async (pincode: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await fetchPincodeServiceability({ pincode });
      if (!response?.serviceable) {
        setState({
          value: pincode,
          error: "This pincode is not serviceable",
          data: null,
          isLoading: false,
        });
      } else {
        setState({
          value: pincode,
          error: undefined,
          data: response,
          isLoading: false,
        });
      }
    } catch (error: any) {
      setState({
        value: pincode,
        error: getCoreServerErrorMessageFromFetcherError(error),
        data: null,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    if (state.value.length === 6 && !state.isLoading) {
      fetchServiceability(state.value);
    }
  }, [state.value]);

  const getLocationText = () => {
    const metadata = state.data?.pincodeMetadata;
    return metadata ? `${metadata.city}, ${metadata.state}` : undefined;
  };

  const handleContinue = () => {
    if (state.value.length < 1) {
      setState((prev) => ({
        ...prev,
        error: "This field is mandatory",
      }));
      return;
    }
    router.push(
      `${TwoWheelerRoutes.TWO_WHEELER_LOAN}${TwoWheelerRoutes.VEHICLE_DETAILS}`
    );
  };

  const isPincodeValid = !!state.data?.serviceable && !state.error;

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
