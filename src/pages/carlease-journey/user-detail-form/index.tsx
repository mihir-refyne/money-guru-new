import PageLayout from "@/components/PageLayout";
import { useState } from "react";
import { SolidFooterActionButton } from "@/components/CarleaseJourney/FooterActionButton";
import {
  UserCarleaseDetailsProps,
  postCarleaseUserFormData,
} from "@/lib/carlease-journey";
import { FormFieldInputContainer } from "@/components/CarleaseJourney/FormInputField";
import { useRouter } from "next/router";
import { CARLEASE_JOURNEY_ROUTES } from "@/components/CarleaseJourney/constants";
import { getCoreServerErrorMessageFromFetcherError } from "@/lib/core-server";
import { toast } from "react-hot-toast";

export default function UserDetailFormPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UserCarleaseDetailsProps>({
    fullName: "",
    mobileNumber: "",
    dateOfBirth: "",
    employerName: "",
    leaseDuration: 3,
    errors: {},
  });

  const handleInputChange = <K extends keyof UserCarleaseDetailsProps>(
    field: K,
    value: UserCarleaseDetailsProps[K]
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

  function validateForm(): boolean {
    let newErrors: Partial<UserCarleaseDetailsProps["errors"]> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!/^[0-9]{10}$/.test(formData.mobileNumber))
      newErrors.mobileNumber = "Invalid Mobile Number";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of Birth is required";
    if (!formData.employerName.trim())
      newErrors.employerName = "Employer Name is required";

    setFormData((prev) => ({
      ...prev,
      errors: {
        ...newErrors,
      },
    }));

    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const result = await postCarleaseUserFormData({
        dateOfBirth: formData.dateOfBirth,
        employerName: formData.employerName,
        fullName: formData.fullName,
        leaseDuration: formData.leaseDuration,
        mobileNumber: formData.mobileNumber,
      });

      toast.success("User details added successfully");
      if (result) router.push(CARLEASE_JOURNEY_ROUTES.CARLEASE_DETAIL_PAGE);
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = getCoreServerErrorMessageFromFetcherError(error);
      if (!errorMessage) return;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout
      pageBackground="white"
      hasContentPadding={false}
      hasLocalButton={false}
      transparentNavbar={false}
      hasBackButton={true}
      footer={
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
            isLoading={isLoading}
            label="Submit"
            onClick={handleSubmit}
          />
        </div>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "24px",
          gap: "24px",
        }}
      >
        <h3
          style={{
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "24px",
          }}
        >
          Please enter below details
        </h3>

        <FormFieldInputContainer
          label="Full Name"
          inputFieldType="text"
          value={formData.fullName}
          fontSize="16px"
          fontWeight="500"
          errorMessage={formData.errors.fullName}
          hasError={!!formData.errors.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
        />
        <FormFieldInputContainer
          label="Mobile Number"
          inputFieldType="number"
          maxLength={10}
          value={formData.mobileNumber}
          fontSize="16px"
          fontWeight="500"
          errorMessage={formData.errors.mobileNumber}
          hasError={!!formData.errors.mobileNumber}
          onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
        />
        <FormFieldInputContainer
          label="Date of Birth"
          inputFieldType="date"
          value={formData.dateOfBirth}
          fontSize="16px"
          fontWeight="500"
          errorMessage={formData.errors.dateOfBirth}
          hasError={!!formData.errors.dateOfBirth}
          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
        />

        <FormFieldInputContainer
          label="Employer Name"
          inputFieldType="text"
          value={formData.employerName}
          fontSize="16px"
          fontWeight="500"
          errorMessage={formData.errors.employerName}
          hasError={!!formData.errors.employerName}
          onChange={(e) => handleInputChange("employerName", e.target.value)}
        />

        <ChooseTenureYear
          currentSelectedTenureYear={formData.leaseDuration}
          onChangeTenure={(value) => handleInputChange("leaseDuration", value)}
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
  const TENURE_YEARS_DATA = [3, 4, 5];

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
        {TENURE_YEARS_DATA.map((item, index) => {
          return <TenureYearChip key={index} tenure={item} />;
        })}
      </div>
    </div>
  );
};
