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
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";

interface PincodeState {
  value: string;
  error?: string;
  serviceabilityResponseData: ServiceabilityResponse | null;
  isLoading: boolean;
}

export default function ConfirmPincodeDetails() {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [pincodeState, setPincodeState] = useState<PincodeState>({
    value: "",
    error: undefined,
    serviceabilityResponseData: null,
    isLoading: false,
  });

  function handlePincodeChange(value: string) {
    setPincodeState({
      value,
      error: undefined,
      serviceabilityResponseData: null,
      isLoading: false,
    });
  }

  const fetchServiceability = async (pincode: string) => {
    setPincodeState((prev) => ({ ...prev, isLoading: true }));
    try {
      if (pincode.startsWith("0")) {
        setPincodeState({
          value: pincode,
          error: "Invalid pincode",
          serviceabilityResponseData: null,
          isLoading: false,
        });
        return;
      }

      const response = await fetchPincodeServiceability({ pincode });

      logAnalyticsEvent(
        ["mixpanel", "webengage"],
        AnalyticEvent.BIKE_LOAN_SERVICE_AVAILABILITY_CHECKED,
        {
          pincode,
          status: response?.serviceable,
        }
      );

      if (!response?.serviceable) {
        setPincodeState({
          value: pincode,
          error: "This area is not serviceable currently",
          serviceabilityResponseData: null,
          isLoading: false,
        });
      } else {
        setPincodeState({
          value: pincode,
          error: undefined,
          serviceabilityResponseData: response,
          isLoading: false,
        });
      }
    } catch (error: any) {
      setPincodeState({
        value: pincode,
        error: getCoreServerErrorMessageFromFetcherError(error),
        serviceabilityResponseData: null,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.BIKE_LOAN_SERVICE_AVAILABILITY_SHOWN
    );
  }, []);

  useEffect(() => {
    if (pincodeState.value.length === 6 && !pincodeState.isLoading) {
      fetchServiceability(pincodeState.value);
    }
  }, [pincodeState.value]);

  const getLocationText = () => {
    const metadata = pincodeState.serviceabilityResponseData?.pincodeMetadata;
    return metadata ? `${metadata.city}, ${metadata.state}` : undefined;
  };

  function handleContinueCTAOnClick() {
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.BIKE_LOAN_SERVICE_AVAILABILITY_CONTINUE_CLICKED
    );
    if (pincodeState.value.length < 1) {
      setPincodeState((prev) => ({
        ...prev,
        error: "This field is mandatory",
      }));
      return;
    }
    router.push(
      `${TwoWheelerRoutes.TWO_WHEELER_LOAN}${TwoWheelerRoutes.VEHICLE_DETAILS}?pincode=${pincodeState.value}`
    );
  }

  const isPincodeValid =
    !!pincodeState.serviceabilityResponseData?.serviceable &&
    !pincodeState.error;

  return (
    <PageLayout
      pageBackground={"var(--clr-background-surface)"}
      hasContentPadding={true}
      hasLocalButton={false}
      hasBackButton={true}
      toUnsetOverflowX={true}
      navbarText="Confirm Pincode"
      footer={
        <FooterButton
          isButtonDisabled={!isPincodeValid}
          label={t("continue_footer_cta")}
          onClick={handleContinueCTAOnClick}
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
          value={pincodeState.value}
          errorMessage={pincodeState.error}
          hasSuccess={isPincodeValid}
          successResponse={getLocationText()}
          hasError={
            !!pincodeState.error && !pincodeState.serviceabilityResponseData
          }
          label={t("enter_pincode_input_label")}
          onChange={(e) => handlePincodeChange(e.target.value)}
        />
      </div>
    </PageLayout>
  );
}
