import { ChangeEvent, FormEvent, useId, useState } from "react";
import EpfTrackerLayout from "./EpfTrackerLayout";
import EpfTrackerLoading from "./EpfTrackerLoading";
import { EpfFetchIdentifier } from "@/lib/epf";
import epfoLogo from "@/images/epfo-logo.svg";
import Image from "next/image";
import Input from "../Input";
import EpfTrackerFetchFooter from "./EpfTrackerFetchFooter";
import epfHeroBlobImageUrl from "@/images/epf-hero-blob.png";
import { isValueIsNumeric } from "@/lib/utils";
import useTranslation from "@/hooks/useTranslation";
import constructElementId from "@/lib/utils/constructElementId";
import { ScreenName } from "@/constants/ScreenName";
import useFetcher from "@/hooks/useFetcher";
import { checkPfStatus } from "@/lib/credit-report";
import EpfTrackerCommonFooter from "./EpfTrackerCommonFooter";
import styles from "./styles.module.css";
import { CaretRight } from "phosphor-react";
import {
  dispatchDataToNativePlatform,
  isCurrentlyOnRefyneWebview,
} from "@/lib/webview";
import { getValueFromMetadata } from "@/lib/core/user-metadata";

const EpfFetchIdentifierToInputLabelMap: Record<EpfFetchIdentifier, string> = {
  mobileNo: "enter_mobile_number_prompt",
  uan: "enter_uan_number_prompt",
};
const EpfFetchIdentifierToChangeButtonLabel: Record<
  EpfFetchIdentifier,
  string
> = {
  mobileNo: "use_mobile_no_btn",
  uan: "use_uan_btn",
};
const EpfFetchIdentifierInputPlaceholderMap: Record<
  EpfFetchIdentifier,
  string
> = {
  mobileNo: "9999999999",
  uan: "100904319456",
};
const EpfFetchIdentifierInputMaxLengthMap: Record<EpfFetchIdentifier, number> =
  {
    mobileNo: 10,
    uan: 12,
  };

function getNextIdentifier(
  currentIdentifier: EpfFetchIdentifier
): EpfFetchIdentifier {
  if (currentIdentifier === "mobileNo") return "uan";
  return "mobileNo";
}

function isValueValid(identifier: EpfFetchIdentifier, value: string): boolean {
  if (identifier === "mobileNo") return value.length === 10;
  if (identifier === "uan") return value.length === 12;
  return false;
}

interface EpfDetailsFetchStartProps {
  identifier: EpfFetchIdentifier;
  initialValue?: string;
  directlyAccessed: boolean;
  onIdentifierChange?: (identifier: EpfFetchIdentifier) => void;
  onSubmit: (identifier: EpfFetchIdentifier, value: string) => void;
  loading?: boolean;
  onFaqClick?: () => void;
}

export default function EpfDetailsFetchStart({
  identifier,
  initialValue = "",
  directlyAccessed,
  onIdentifierChange,
  onSubmit,
  loading = false,
  onFaqClick,
}: EpfDetailsFetchStartProps) {
  const { t, tWithoutTypeSafety } = useTranslation("common");
  const formId = useId();
  const [identifierValue, setIdentifierValue] = useState<string>(initialValue);
  const isTypedIdentifierValueValid = isValueValid(identifier, identifierValue);
  const nextIdentifier = getNextIdentifier(identifier);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;
    if (!isValueIsNumeric(value)) return;
    setIdentifierValue(value);
  }

  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit?.(identifier, identifierValue);
  }

  if (loading) return <EpfTrackerLoading />;

  return (
    <EpfTrackerLayout
      hasContentPadding={false}
      hasFooter={false}
      dispatchPopEventOnBackClick={directlyAccessed}
    >
      <div
        className="px-4 pt-6"
        style={{
          backgroundImage: `url(${epfHeroBlobImageUrl.src}), linear-gradient( #EBF5FF 100% ,#FFFFFF 0%)`,
          backgroundPositionX: "right",
          backgroundPositionY: "50%",
          backgroundRepeat: "no-repeat",
          paddingBottom: "6.4rem",
        }}
      >
        <Image src={epfoLogo} alt="epfo-logo" />
        <h2 className="text-sub-title text-semibold  mt-6">
          Employees&apos; Provident Fund Organisation, India
        </h2>
        <h4 className="text-body text-regular clr-text-secondary mt-4 mb-4">
          {t("check_pf_balance_offer")}
        </h4>
      </div>
      <form
        id={formId}
        onSubmit={handleFormSubmit}
        className="px-4"
        style={{
          transform: "translateY(-65%)",
        }}
      >
        <Input
          className="px-4"
          inputMode="numeric"
          label={tWithoutTypeSafety(
            EpfFetchIdentifierToInputLabelMap[identifier]
          )}
          rightLabel={
            onIdentifierChange && (
              <button
                id={constructElementId({
                  screenName: ScreenName.MONGU_PF_TRACKER_AUTH_START,
                  elementName: "AUTH_IDENTIFIER_TOGGLE_BUTTON",
                })}
                type="button"
                className="text-caption text-semibold clr-brand-default"
                onClick={() => onIdentifierChange(nextIdentifier)}
              >
                {tWithoutTypeSafety(
                  EpfFetchIdentifierToChangeButtonLabel[nextIdentifier]
                )}
              </button>
            )
          }
          value={identifierValue}
          onChange={handleChange}
          placeholder={EpfFetchIdentifierInputPlaceholderMap[identifier]}
          maxLength={EpfFetchIdentifierInputMaxLengthMap[identifier]}
        />
      </form>

      <div className="px-4">
        <EpfTrackerFetchFooter
          formId={formId}
          buttonDisabled={!isTypedIdentifierValueValid}
        />
      </div>

      <div className="px-4">
        <div className={styles.hello}>
          <h4>{t("facing_issues")}</h4>
          <h5 className="text-body text-regular clr-text-secondary mt-1">
            {t("pf-faq-desc")}
          </h5>
          <button className="btn btn-text btn-compact" onClick={onFaqClick}>
            {t("check_faqs")}
            <CaretRight />
          </button>
        </div>
      </div>
    </EpfTrackerLayout>
  );
}
