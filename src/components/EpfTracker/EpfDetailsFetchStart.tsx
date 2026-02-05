import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
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
import styles from "./styles.module.css";
import { CaretRight, CheckCircle } from "phosphor-react";
import redWarningImage from "@/images/warning-red.svg";
import toast from "react-hot-toast";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import useSyntheticLoader from "@/hooks/useSyntheticLoader";

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
  isEpfPortalDown?: boolean;
}

const HEADER_BACKGROUND_COLOR = "linear-gradient( #EBF5FF 100% ,#FFFFFF 0%)";
const SYNTHETIC_LOADER_TIME_IN_MS = 2500;

export default function EpfDetailsFetchStart({
  identifier,
  initialValue = "",
  directlyAccessed,
  onIdentifierChange,
  onSubmit,
  loading = false,
  onFaqClick,
  isEpfPortalDown,
}: EpfDetailsFetchStartProps) {
  const { t, tWithoutTypeSafety } = useTranslation("common");
  const formId = useId();
  const [identifierValue, setIdentifierValue] = useState<string>(initialValue);

  const { isLoading: isSyntheticLoading, setIsLoading } = useSyntheticLoader(
    true,
    SYNTHETIC_LOADER_TIME_IN_MS
  );

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

  useEffect(() => {
    setIsLoading(true);
  }, []);

  // Clear input value when identifier changes
  useEffect(() => {
    setIdentifierValue("");
  }, [identifier]);

  if (loading || isSyntheticLoading) return <EpfTrackerLoading />;

  if (isEpfPortalDown)
    return (
      <EpfTrackerLayout
        hasContentPadding={false}
        hasFooter={false}
        dispatchPopEventOnBackClick={directlyAccessed}
        navbarBackground={HEADER_BACKGROUND_COLOR}
      >
        <PFDownExplainer onFaqClick={onFaqClick} />
      </EpfTrackerLayout>
    );

  return (
    <EpfTrackerLayout
      hasContentPadding={false}
      hasFooter={false}
      dispatchPopEventOnBackClick={directlyAccessed}
      navbarBackground={HEADER_BACKGROUND_COLOR}
    >
      <div
        className="px-4 pt-6"
        style={{
          backgroundImage: `url(${epfHeroBlobImageUrl.src}),${HEADER_BACKGROUND_COLOR} `,
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

      <div className={styles.Footer_top}>
        <EpfTrackerFetchFooter
          formId={formId}
          buttonDisabled={!isTypedIdentifierValueValid}
        />
      </div>

      <div className="px-4 mt-8">
        <FaqLinkSection onFaqClick={onFaqClick} />
      </div>
    </EpfTrackerLayout>
  );
}
function FaqLinkSection({ onFaqClick }: { onFaqClick?: () => void }) {
  const { t } = useTranslation("common");
  return (
    <div className={styles.Epf_faq_section}>
      <h4 className="text-body text-semibold">
        {t("money_guru_facing_issues")}
      </h4>
      <h5 className="text-regular text-caption clr-text-secondary mt-2">
        {t("money_guru_pf_faq_desc")}
      </h5>
      <button className="btn-text flex-center" onClick={onFaqClick}>
        <h3 className="text-body text-semibold">
          {t("money_guru_check_faqs")}
        </h3>

        <CaretRight weight="bold" />
      </button>
    </div>
  );
}

function PFDownExplainer({ onFaqClick }: { onFaqClick?: () => void }) {
  const [isNotifyClicked, setIsNotifyClicked] = useState(false);
  const { t, tWithoutTypeSafety } = useTranslation("common");
  useEffect(() => {
    logAnalyticsEvent(
      ["mixpanel", "webengage"],
      AnalyticEvent.EPFO_UNAVAILABLE_SCREEN
    );
  }, []);
  return (
    <div>
      <div
        className="px-4 pt-6"
        style={{
          backgroundImage: `url(${epfHeroBlobImageUrl.src}),${HEADER_BACKGROUND_COLOR} `,
          backgroundPositionX: "right",
          backgroundPositionY: "50%",
          backgroundRepeat: "no-repeat",
          paddingBottom: "6.4rem",
        }}
      >
        <Image src={redWarningImage} alt="warning" />
        <h3 className="text-heading text-semibold mt-4">
          {t("pf_tracker_down_header_title")}
        </h3>
        <h3 className="text-body text-regular clr-text-secondary mt-4">
          {t("pf_tracker_down_header_desc")}
        </h3>
        <button
          className="btn btn-primary btn-block mt-8"
          disabled={isNotifyClicked}
          onClick={() => {
            setIsNotifyClicked(true);
            logAnalyticsEvent(
              ["mixpanel", "webengage"],
              AnalyticEvent.EPFO_UNAVAILABLE_SCREEN_NOTIFY_CTA_CLICKED
            );
            toast(t("epfo_we_will_notify_you"), {
              style: {
                background: "var(--clr-text-primary)",
                color: "var(--clr-pure-white)",
                width: "100%",
              },
              duration: 2000,
            });
          }}
        >
          {t("pf_tracker_down_header_cta_text")}
        </button>
        {isNotifyClicked && (
          <div className="flex-center mt-6">
            <CheckCircle color="#01752F" weight="fill" size={16} />
            <h3 className="text-body pl-1" style={{ color: "#01752F" }}>
              {t("pf_tracker_down_header_will_notify_you_text")}
            </h3>
          </div>
        )}
      </div>
      <div className="px-4" style={{ marginTop: "-4rem" }}>
        <FaqLinkSection onFaqClick={onFaqClick} />
      </div>
    </div>
  );
}
