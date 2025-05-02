import PageLayout from "@/components/PageLayout";
import Image from "next/image";
import RightArrowIcon from "../../../../public/assets/images/carlease-journey/right-arrow-icon.svg";
import { useRouter } from "next/router";
import { SolidFooterActionButton } from "@/components/CarleaseJourney/FooterActionButton";
import { LeaseCalculatorFormInput } from "@/lib/carlease-journey";
import { FormFieldInputContainer } from "@/components/CarleaseJourney/FormInputField";
import { useQueryState } from "nuqs";
import { CARLEASE_JOURNEY_ROUTES } from "@/components/CarleaseJourney/constants";

export default function CalculateTaxBenefitsPage() {
  const router = useRouter();
  const USER_FORM_KEY = "userForm";

  const [formData, setFormData] = useQueryState(USER_FORM_KEY, {
    defaultValue: {
      errors: {},
      exShowroomPrice: 0,
      residualValuePercentage: 0,
      roadTaxPercentage: 0,
      tenureYears: 1,
      isNewCar: false,
    } as LeaseCalculatorFormInput,
    parse: (value) => JSON.parse(decodeURIComponent(value)),
    serialize: (formData: LeaseCalculatorFormInput) =>
      encodeURIComponent(JSON.stringify(formData)),
  });

  const handleInputChange = <K extends keyof LeaseCalculatorFormInput>(
    field: K,
    value: LeaseCalculatorFormInput[K]
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

  function validateFields() {
    let newErrors: Partial<LeaseCalculatorFormInput["errors"]> = {};

    if (!formData.exShowroomPrice)
      newErrors.exShowroomPrice = "ex Showroom Price is required";

    if (!formData.residualValuePercentage) {
      newErrors.residualValuePercentage =
        "Residual Value Percentage is required";
    }

    if (!formData.roadTaxPercentage && formData.isNewCar)
      newErrors.roadTaxPercentage = "Road Tax Percentage is required";

    if (!formData.tenureYears)
      newErrors.tenureYears = "Tenure Year is required";

    setFormData((prev) => ({
      ...prev,
      errors: {
        ...newErrors,
      },
    }));

    const hasErrors = Object.keys(newErrors).length > 0;

    return hasErrors;
  }

  return (
    <PageLayout
      pageBackground="white"
      hasContentPadding={false}
      hasLocalButton={false}
      transparentNavbar={false}
      hasBackButton={true}
      footer={
        <FooterActionButtons
          onClick={() => {
            if (validateFields()) return;

            const useFormEncodedDataQueryParam = `${USER_FORM_KEY}=${encodeURIComponent(
              JSON.stringify(formData)
            )}`;

            setTimeout(() => {
              router.push(
                `${CARLEASE_JOURNEY_ROUTES.SUMMARY}?${useFormEncodedDataQueryParam}`
              );
            }, 0);
          }}
        />
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "24px",
          gap: "32px",
        }}
      >
        <h3
          style={{
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "24px",
          }}
        >
          Please enter below detail to calculate your tax benefits
        </h3>

        <ChooseCarType
          isNewCar={formData.isNewCar}
          onChangeType={(e) => {
            handleInputChange("isNewCar", e);
          }}
        />
        <FormFieldInputContainer
          value={formData.exShowroomPrice === 0 ? "" : formData.exShowroomPrice}
          placeHolderText="50,00,000"
          label="Enter ex Showroom Price"
          inputFieldType="currency"
          errorMessage={formData.errors?.exShowroomPrice ?? ""}
          hasError={Boolean(formData.errors.exShowroomPrice)}
          onChange={(e) => {
            handleInputChange("exShowroomPrice", Number(e.target.value));
          }}
        />

        <FormFieldInputContainer
          value={
            formData.residualValuePercentage === 0
              ? ""
              : formData.residualValuePercentage
          }
          placeHolderText="2%"
          label="Enter Residual Percentage (%)"
          inputFieldType="number"
          errorMessage={formData.errors.residualValuePercentage}
          hasError={Boolean(formData.errors.residualValuePercentage)}
          onChange={(e) => {
            handleInputChange(
              "residualValuePercentage",
              Number(e.target.value)
            );
          }}
        />
        {formData.isNewCar && (
          <FormFieldInputContainer
            value={
              formData.roadTaxPercentage === 0 ? "" : formData.roadTaxPercentage
            }
            placeHolderText="20%"
            label="Enter Road Tax Percentage (%)"
            inputFieldType="number"
            errorMessage={formData.errors.roadTaxPercentage}
            hasError={Boolean(formData.errors.roadTaxPercentage)}
            onChange={(e) => {
              handleInputChange("roadTaxPercentage", Number(e.target.value));
            }}
          />
        )}

        <ChooseTenureYear
          currentSelectedTenureYear={formData.tenureYears}
          onChangeTenure={(value) => {
            handleInputChange("tenureYears", value);
          }}
        />
      </div>
    </PageLayout>
  );
}

const ChooseTenureYear = ({
  currentSelectedTenureYear,
  onChangeTenure,
}: {
  currentSelectedTenureYear: number;
  onChangeTenure: (tenure: number) => void;
}) => {
  const TenureYearChip = ({ tenure }: { tenure: number }) => {
    return (
      <div
        key={tenure}
        style={{
          display: "flex",
          padding: "8px",
          borderRadius: "4px",
          backgroundColor:
            currentSelectedTenureYear === tenure
              ? "var(--clr-bg-primary-lighter)"
              : "white",
          border:
            currentSelectedTenureYear === tenure
              ? "1px solid var(--clr-brand-default)"
              : "1px solid var(--clr-border-enabled)",
        }}
        onClick={() => onChangeTenure(tenure)}
      >
        <p
          style={{
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
            color:
              currentSelectedTenureYear === tenure
                ? "var(--clr-brand-default)"
                : "#121212",
          }}
        >
          {tenure} Years
        </p>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <p
        style={{
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: "20px",
        }}
      >
        Choose the tenure
      </p>

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {[...Array.from({ length: 5 }, (_, i) => i + 1)].map((item, index) => {
          return <TenureYearChip key={index} tenure={item} />;
        })}
      </div>
      {/* {currentSelectedTenureYear === 0 && (
        <p className={`${styles.input_field_response_text} ${styles.error}`}>
          {'Tenu'}
        </p>
      )} */}
    </div>
  );
};

const ChooseCarType = ({
  isNewCar,
  onChangeType,
}: {
  isNewCar: boolean | undefined;
  onChangeType: (tenure: boolean) => void;
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <p
        style={{
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: "20px",
        }}
      >
        Choose the Car Type
      </p>

      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          {" "}
          <input
            type="radio"
            checked={!isNewCar}
            onChange={() => onChangeType(false)}
          />
          Old Car
        </div>
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          {" "}
          <input
            type="radio"
            checked={isNewCar}
            onChange={() => onChangeType(true)}
          />
          New Car
        </div>
      </div>
    </div>
  );
};

const FooterActionButtons = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: "16px 24px",
        marginTop: "auto",
        gap: "8px",
      }}
    >
      <SolidFooterActionButton
        label="Proceed"
        // onClick={() => router.push(CARLEASE_JOURNEY_ROUTES.SUMMARY)}
        onClick={onClick}
        icon={<Image src={RightArrowIcon} alt="left arrow" />}
      />
    </div>
  );
};
