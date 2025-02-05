import { RefObject, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import PageLayout from "@/components/PageLayout";
import { InputContainer } from "@/components/TwoWheelerLoan/InputContainer";
import useTranslation from "@/hooks/useTranslation";
import styles from "../../two-wheeler-loan/styles.module.css";
import { FooterButton } from "@/components/TwoWheelerLoan/FooterButton";
import Modal from "@/components/Modal";
import { TypeOfVehicleRadioButtonGroup } from "@/components/TwoWheelerLoan/VehicleTypeRadioGroupWithLabel";
import { applyForLoan, EngineType } from "@/lib/two-wheeler-loan";
import {
  ChooseTenureDropDownList,
  ChooseTenureDropDownMenu,
} from "@/components/TwoWheelerLoan/VehicleDetailsForm/ChooseTenureDropDownMenu";
import { getCoreServerErrorMessageFromFetcherError } from "@/lib/core-server";
import { TwoWheelerRoutes } from "@/components/TwoWheelerLoan/constants";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import TwoWheelerLoanConfigData from "../../../../data/two_wheeler_config.json";
import { useQueryState } from "nuqs";

interface VehicleLoanFormData {
  vehicleType: string;
  engineType: EngineType;
  applicationAmount: number;
  onRoadPrice: number;
  tenure: number;
  pincode: string;
  isTermsConditionsChecked: boolean;
  errors: {
    applicationAmount?: string;
    onRoadPrice?: string;
  };
}

export default function VehicleDetails() {
  const { t } = useTranslation("common");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const routerParam = router.query.pincode as unknown;
  const pincode = routerParam as string;

  const [formData, setFormData] = useQueryState("vehicleForm", {
    defaultValue: {
      vehicleType: "TWO_WHEELER",
      engineType: EngineType.ICE,
      applicationAmount: 0,
      onRoadPrice: 0,
      tenure: 24,
      pincode: pincode,
      isTermsConditionsChecked: false,
      errors: {},
    } as VehicleLoanFormData,
    parse: (value: string) => JSON.parse(decodeURIComponent(value)),
    serialize: (value: VehicleLoanFormData) =>
      encodeURIComponent(JSON.stringify(value)),
  });

  const INITIAL_PLACEHOLDER_VALUE_ON_ROAD_VEHICLE = "1,00,000";
  const INITIAL_PLACEHOLDER_VALUE_ON_LOAN_VALUE = "65,000";

  useEffect(() => {
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.BIKE_LOAN_APPLICATION_FORM_SHOWN
    );
  }, []);

  const handleInputChange = <K extends keyof VehicleLoanFormData>(
    field: K,
    value: VehicleLoanFormData[K]
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      errors: {
        ...prev.errors,
        [field]: undefined,
      },
    }));
  };

  const validateApplicationAmount = (): string | undefined => {
    const { applicationAmount, onRoadPrice } = formData;
    if (applicationAmount === 0) {
      return "This field is mandatory";
    }
    if (applicationAmount > onRoadPrice) {
      return "Loan amount cannot be greater than On-road price of the vehicle!";
    }
    if (applicationAmount > 350000) {
      return "Loan amount cannot be greater than Rs. 3,50,000.";
    }
    return undefined;
  };

  const validateOnRoadPrice = (): string | undefined => {
    const { onRoadPrice } = formData;
    if (onRoadPrice === 0) {
      return "This field is mandatory";
    }
    return undefined;
  };

  const validateFields = (): boolean => {
    const applicationAmountError = validateApplicationAmount();
    const onRoadPriceError = validateOnRoadPrice();

    setFormData((prev) => ({
      ...prev,
      errors: {
        applicationAmount: applicationAmountError,
        onRoadPrice: onRoadPriceError,
      },
    }));

    const hasErrors = !!applicationAmountError || !!onRoadPriceError;

    return hasErrors;
  };

  async function handleFormSubmit() {
    if (validateFields()) return;

    try {
      setIsLoading(true);
      await applyForLoan({
        applicationAmount: formData?.applicationAmount ?? 0,
        engineType: formData.engineType,
        onRoadPrice: formData?.onRoadPrice ?? 0,
        pincode: formData.pincode,
        tenure: formData.tenure,
        vehicleType: "TWO_WHEELER",
      });
      setIsLoading(false);

      logAnalyticsEvent(
        ["mixpanel", "webengage"],
        AnalyticEvent.BIKE_LOAN_APPLICATION_FORM_SUBMITTED
      );

      router.push(
        `${TwoWheelerRoutes.TWO_WHEELER_LOAN}${TwoWheelerRoutes.APPLICATION_STATUS}`
      );
    } catch (error: any) {
      const errorMessage = getCoreServerErrorMessageFromFetcherError(error);
      if (!errorMessage) return;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageLayout
      pageBackground={"var(--clr-background-surface)"}
      hasContentPadding={true}
      hasLocalButton={false}
      hasBackButton={true}
      navbarText="Vehicle Details"
      toUnsetOverflowX={false}
      footer={
        <>
          <div
            style={{
              marginTop: "auto",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <input
              type="checkbox"
              checked={formData.isTermsConditionsChecked}
              onChange={() =>
                handleInputChange(
                  "isTermsConditionsChecked",
                  !formData.isTermsConditionsChecked
                )
              }
            />
            <p
              style={{
                fontWeight: "400",
                fontSize: "12px",
                lineHeight: "16px",
                color: "var(--clr-pure-grey)",
              }}
            >
              {t("two_wheeler_terms_continue_text")}{" "}
              <button
                style={{
                  cursor: "pointer",
                  color: "var(--clr-brand-default)",
                }}
                onClick={() => {
                  router.push(
                    `${
                      TwoWheelerRoutes.TERMS_AND_CONDITIONS
                    }?tnc=${encodeURIComponent(
                      TwoWheelerLoanConfigData.applicationDetailsData
                        .termsConditionsUrl
                    )}`
                  );
                }}
              >
                {t("two_wheeler_terms_condition")}
              </button>
            </p>
          </div>
          <FooterButton
            isButtonDisabled={!formData.isTermsConditionsChecked || isLoading}
            label={t("vehicle_details_submit_application_cta_label")}
            onClick={handleFormSubmit}
          />
        </>
      }
    >
      <div className={styles.pincode_container}>
        <div className={styles.pincode_header_wrapper}>
          <h2 className={styles.pincode_title}>
            {t("vehicle_details_add_details")}
          </h2>
          <h4 className={styles.pincode_subtitle}>
            {t("fill_details_input_label")}
          </h4>
        </div>
        <TypeOfVehicleRadioButtonGroup
          value={formData.engineType}
          onChange={(value: EngineType) =>
            handleInputChange("engineType", value)
          }
        />
        <InputContainer
          value={formData.onRoadPrice === 0 ? "" : formData.onRoadPrice}
          label={"On-road vehicle price"}
          isBorderDisabled={true}
          inputFieldType="currency"
          errorMessage={formData.errors.onRoadPrice}
          hasError={!!formData.errors.onRoadPrice}
          isFieldMandatory={true}
          placeHolderText={INITIAL_PLACEHOLDER_VALUE_ON_ROAD_VEHICLE}
          onChange={(e) => {
            handleInputChange("onRoadPrice", Number(e.target.value));
          }}
        />
        <InputContainer
          value={
            formData.applicationAmount === 0 ? "" : formData.applicationAmount
          }
          label={"Loan amount"}
          isBorderDisabled={true}
          inputFieldType="currency"
          errorMessage={formData.errors.applicationAmount}
          hasError={!!formData.errors.applicationAmount}
          isFieldMandatory={true}
          placeHolderText={INITIAL_PLACEHOLDER_VALUE_ON_LOAN_VALUE}
          onChange={(e) => {
            handleInputChange("applicationAmount", Number(e.target.value));
          }}
        />
        <ChooseTenureDropDownMenu
          tenure={formData.tenure}
          onClick={() => setIsModalOpen(true)}
        />

        <div
          style={{
            marginBottom: "32px",
          }}
        >
          <Modal
            active={isModalOpen}
            bottomSheetOnMobile
            onClose={() => {
              setIsModalOpen(false);
            }}
          >
            <ChooseTenureDropDownList
              value={formData.tenure}
              onChange={(tenure) => handleInputChange("tenure", tenure)}
              onClose={() => {
                setIsModalOpen(false);
              }}
            />
          </Modal>
        </div>
      </div>
    </PageLayout>
  );
}
