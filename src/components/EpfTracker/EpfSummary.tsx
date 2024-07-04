import {
  EpfDetailsResponse,
  EpfFetchIdentifier,
  isEligibleForRefetchOfEpfDetails,
  isEpfDetailsIncrementEffectShown,
  setEpfDetailsIncrementEffectShown,
} from "@/lib/epf";
import EpfTrackerLayout from "./EpfTrackerLayout";
import Card from "../Card";
import LabelValue from "../LabelValue";
import Separator from "../Separator";
import format from "date-fns/format";
import ListCard from "../ListCard";
import InfoCard from "../InfoCard";
import IconWrapper from "../IconWrapper";
import { formatToInr } from "@/lib/utils";
import { getEpfServicePeriodText } from "./helpers";
import { useEffect, useState } from "react";
import { useAutoIncrementNumber } from "@/hooks/useAutoIncrementNumber";
// import EpfSummaryCardBg from "@/images/epf_summary_card_bg.svg";
import useTranslation from "@/hooks/useTranslation";
import PfPassbookBgUrl from "@/images/pf_passbook_bg.svg";
import {
  ArrowRight,
  ArrowsClockwise,
  Buildings,
  CaretRight,
} from "phosphor-react";
import toast from "react-hot-toast";
import constructElementId from "@/lib/utils/constructElementId";
import { ScreenName } from "@/constants/ScreenName";
import Link from "next/link";

const AUTO_INCREMENT_DURATION_IN_MS = 2 * 1000;
const MIN_REFETCH_DISABLED_CLICK_COUNT_TO_SHOW_INFO = 3;

interface EpfSummaryProps {
  epfDetails: EpfDetailsResponse;
  directlyAccessed: boolean;
  onMount?: () => void;
  onEstablishmentCardClick: (memberId: string) => void;
  onRefetchClick?: (identifier: EpfFetchIdentifier, value?: string) => void;
  onFaqClick?: () => void;
}

export default function EpfSummary({
  epfDetails,
  directlyAccessed,
  onMount,
  onEstablishmentCardClick,
  onRefetchClick,
  onFaqClick,
}: EpfSummaryProps) {
  const { t } = useTranslation("common");
  const { summary, establishments, metadata = {} } = epfDetails;

  const [isEpfDetailsIncrementEffectAlreadyShown] = useState(
    isEpfDetailsIncrementEffectShown
  );
  const [disabledRefetchClickCount, setDisabledRefetchClickCount] =
    useState<number>(0);

  const today = new Date();
  const isRefetchPossible =
    !!metadata.fetchedAt &&
    isEligibleForRefetchOfEpfDetails(today, new Date(metadata.fetchedAt));

  useEffect(() => {
    onMount?.();
  }, []);

  useEffect(() => {
    if (isEpfDetailsIncrementEffectAlreadyShown) return;
    setEpfDetailsIncrementEffectShown();
  }, [isEpfDetailsIncrementEffectAlreadyShown]);

  useEffect(() => {
    if (
      disabledRefetchClickCount < MIN_REFETCH_DISABLED_CLICK_COUNT_TO_SHOW_INFO
    )
      return;
    toast(t("epfo_passbook_update_rule_info_msg"), {
      id: "epfo_passbook_update_rule_info_msg",
    });
  }, [disabledRefetchClickCount]);

  function handleRefetchClick() {
    if (!isRefetchPossible) {
      setDisabledRefetchClickCount((prev) => prev + 1);
      return;
    }
    const identifier: EpfFetchIdentifier = metadata.uan ? "uan" : "mobileNo";
    const value = metadata.uan ?? metadata.mobileNo;
    onRefetchClick?.(identifier, value);
  }

  function getCardFooter(
    lastFetchedAt: string | undefined,
    refetchEnabled: boolean,
    onRefetchClick?: VoidFunction
  ) {
    if (!lastFetchedAt) return null;
    return (
      <Link
        href={`/epf-tracker/epf-how-to-withdrawal-summary`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#0057B7",
          border: "1px solid rgb(186, 215, 255)",
          width: "100%",
          padding: "0.7rem",
          textDecoration: "none",
        }}
      >
        <h2 className="text-body">{t("learn_how_to_withdraw_pf")}</h2>
        <CaretRight />
      </Link>
    );
  }

  // INFO: We want to show the total balance
  const totalBalance = Math.floor(
    summary.currentBalance + summary.currentPensionBalance
  );
  const totalEmployeeShare = Math.floor(summary.currentEmployeeShareBalance);
  const totalEmployerShare = Math.floor(
    summary.currentEmployerShareBalance + summary.currentPensionBalance
  );

  const totalBalanceWithAutoIncrement = useAutoIncrementNumber({
    active: !isEpfDetailsIncrementEffectAlreadyShown,
    durationInMs: AUTO_INCREMENT_DURATION_IN_MS,
    value: totalBalance,
  });
  const totalEmployeeShareWithAutoIncrement = useAutoIncrementNumber({
    active: !isEpfDetailsIncrementEffectAlreadyShown,
    durationInMs: AUTO_INCREMENT_DURATION_IN_MS,
    value: totalEmployeeShare,
  });
  const totalEmployerShareWithAutoIncrement = useAutoIncrementNumber({
    active: !isEpfDetailsIncrementEffectAlreadyShown,
    durationInMs: AUTO_INCREMENT_DURATION_IN_MS,
    value: totalEmployerShare,
  });

  return (
    <EpfTrackerLayout dispatchPopEventOnBackClick={directlyAccessed} hasShare>
      <Card
        // TODO: Ask why colors are not from design system
        border="1px solid #BAD7FF"
        backgroundImageUrl={PfPassbookBgUrl.src}
        footerBackgroundColor="#FFFFFF"
        footer={getCardFooter(
          metadata.fetchedAt,
          isRefetchPossible,
          handleRefetchClick
        )}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <LabelValue
            type="dark"
            label={t("pf_balance_label")}
            labelTextVariant="heading_regular"
            value={totalBalanceWithAutoIncrement}
            formatter={formatToInr}
            valueTextVariant="title_medium"
          />
          <ArrowsClockwise
            size={25}
            style={{ color: "#0057B7", marginBottom: 10, marginLeft: 8 }}
          />
        </div>
        <div
          style={{
            backgroundColor: "#F7F7F7",
            width: "40%",
            padding: " 0.7rem",

            borderRadius: "0.5rem",
          }}
        >
          <p className="clr-text-secondary text-caption">
            {t("last_updated")}{" "}
            {format(new Date(metadata.fetchedAt ?? ""), "dd MMM yy")}
          </p>
        </div>
        {/* <div
          className="mt-4"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#0057B7",
          }}
        ></div> */}
      </Card>

      <h2
        className="text-body text-semibold mt-6 mb-4"
        style={{ paddingLeft: "var(--spacing-2w)" }}
      >
        {t("all_employers_label")} ({establishments.length})
      </h2>
      <div>
        {/* TODO: Check the Array order */}
        {establishments.map((establishment, index) => {
          const isLastElement = establishments.length === index + 1;
          const {
            memberId,
            establishmentName,
            dateOfJoiningInEPF,
            dateOfFirstTransaction,
            dateOfLastTransaction,
            totalPensionBalance,
            passbookEntries,
          } = establishment;
          const { employeeShare = 0, employerShare = 0 } =
            passbookEntries[0] ?? {};
          const servicePeriodContainerWithLabel = (
            <div>
              {getEpfServicePeriodText({
                dateOfJoiningInEPF:
                  dateOfJoiningInEPF ?? dateOfFirstTransaction,
                dateOfExitFromEPF: dateOfLastTransaction,
              }) ?? ""}
              <div>
                <span
                  style={{
                    display: "inline-block",
                    background: "#F0FFF2",
                    color: "#01752F",
                    padding: "4px 8px",
                    marginTop: 4,
                  }}
                >
                  Latest deposit: INR{" "}
                  {formatToInr(employeeShare + employerShare)}
                </span>
              </div>
            </div>
          );
          return (
            <>
              <ListCard
                key={memberId}
                className="mb-4"
                background="white"
                items={[
                  {
                    contentRightTitle: formatToInr(totalPensionBalance),
                    contentLeftTitle: establishmentName,
                    contentLeftDescription: servicePeriodContainerWithLabel,
                    onClick: () => onEstablishmentCardClick(memberId),
                  },
                ]}
              />
              {isLastElement ? null : <hr />}
            </>
          );
        })}
      </div>
      <div>
        <div
          style={{
            marginTop: "var(--spacing-8)",
            border: "1px solid var(--clr-grey-default)",
            borderRadius: " var(--spacing-2)",
            padding: "var(--spacing-3)",
          }}
        >
          <h4 className="text-body text-semibold">
            {t("money_guru_facing_issues")}
          </h4>
          <h5 className="text-regular text-caption clr-text-secondary mt-2">
            {t("money_guru_pf_faq_desc")}
          </h5>
          <button
            className="btn-text text-body text-semibold"
            onClick={onFaqClick}
          >
            {t("money_guru_check_faqs")}
            <CaretRight weight="bold" />
          </button>
        </div>
      </div>
      {/* <InfoCard>{t("epf_info_disclaimer")}</InfoCard> */}
    </EpfTrackerLayout>
  );
}
