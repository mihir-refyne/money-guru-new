import {
  EpfDetailsResponse,
  EpfFetchIdentifier,
  isEligibleForRefetchOfEpfDetails,
  isEpfDetailsIncrementEffectShown,
  setEpfDetailsIncrementEffectShown,
} from "@/lib/epf";
import EpfTrackerLayout from "./EpfTrackerLayout";
import LabelValue from "../LabelValue";
import format from "date-fns/format";
import ListCard from "../ListCard";
import { useEffect, useState } from "react";
import { useAutoIncrementNumber } from "@/hooks/useAutoIncrementNumber";
import useTranslation from "@/hooks/useTranslation";
import PfPassbookBgUrl from "@/images/pf_passbook_bg.svg";
import { ArrowsClockwise, CaretRight } from "phosphor-react";
import toast from "react-hot-toast";

import Link from "next/link";
import CardV2 from "../CardV2";
import { getEpfServicePeriodText } from "./helpers";
import { formatToInr } from "@/lib/utils";

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

// Utility function for formatting currency
function formatCurrency(value: number, isEmployerCard = false): string {
  if (value < 1000) {
    return `₹${value}`;
  }
  if (value < 100000) {
    // For thousands
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  if (value < 10000000) {
    // For lakh
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (value < 1000000000) {
    // For crore
    return `₹${(value / 10000000).toFixed(1)}CR`;
  }
  // For hundred crore and above
  return `₹${(value / 10000000).toFixed(1)}CR`;
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

  function getCardFooter(lastFetchedAt: string | undefined) {
    if (!lastFetchedAt) return null;
    return (
      <Link
        href={`/epf-tracker/epf-how-to-withdrawal-summary`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "var(--clr-brand-default)",
          width: "100%",
          textDecoration: "none",
        }}
      >
        <h2 className="text-body">{t("learn_how_to_withdraw_pf")}</h2>
        <CaretRight />
      </Link>
    );
  }

  // INFO: We want to show the total balance
  const totalBalance = Math.floor(summary.currentBalance);

  const totalBalanceWithAutoIncrement = useAutoIncrementNumber({
    active: !isEpfDetailsIncrementEffectAlreadyShown,
    durationInMs: AUTO_INCREMENT_DURATION_IN_MS,
    value: totalBalance,
  });

  return (
    <EpfTrackerLayout dispatchPopEventOnBackClick={directlyAccessed} hasShare>
      <CardV2
        border="0.5px solid var(--clr-icon-primary-light)"
        backgroundImageUrl={PfPassbookBgUrl.src}
        backgroundGradient="linear-gradient(263deg, #EFF6FF85 30%, #FFFFFF 60%)"
        backgroundPositionX="100%"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        footer={getCardFooter(metadata.fetchedAt)}
        footerBackgroundColor="white"
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
            formatter={(value) => formatToInr(value)}
            valueTextVariant="title_medium"
          />
          {isRefetchPossible && (
            <ArrowsClockwise
              onClick={handleRefetchClick}
              size={25}
              style={{
                color: "var(--clr-brand-default)",
                marginBottom: 10,
                marginLeft: 8,
              }}
            />
          )}
        </div>
        <div
          style={{
            backgroundColor: "#F7F7F7",
            width: "40%",
            padding: "0.7rem",
            borderRadius: "0.5rem",
          }}
        >
          <p className="clr-text-secondary text-caption">
            {t("last_updated")}{" "}
            {format(new Date(metadata.fetchedAt ?? ""), "dd MMM")}
          </p>
        </div>
      </CardV2>

      <h2
        className="text-body text-semibold mt-6 mb-4"
        style={{ paddingLeft: "var(--spacing-2)", color: "#888888" }}
      >
        {t("all_employers_label")} ({establishments.length})
      </h2>
      <div>
        <ListCard
          className="mb-4"
          background="#fff"
          border="1px solid var(--clr-border-enabled)"
          shadow="1px 0px 10px 1px #1212120A"
          items={establishments.map((establishment, index) => {
            const {
              memberId,
              totalEmployeeShare,
              totalEmployerShare,
              establishmentName,
              dateOfJoiningInEPF,
              dateOfFirstTransaction,
              dateOfLastTransaction,
              passbookEntries,
            } = establishment;

            const { employeeShare = 0, employerShare = 0 } =
              passbookEntries[0] ?? {};

            const isLatestEstablishment = index === 0;

            const servicePeriodContainerWithLabel = (
              <div>
                {getEpfServicePeriodText({
                  dateOfJoiningInEPF:
                    dateOfJoiningInEPF ?? dateOfFirstTransaction,
                  dateOfExitFromEPF: dateOfLastTransaction,
                }) ?? ""}
                {isLatestEstablishment && (
                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        background: "#F0FFF2",
                        color: "var(--clr-icon-accent-success)",
                        padding: "4px 8px",
                        marginTop: 4,
                      }}
                    >
                      {t("pf_latest_deposit") + " "}

                      {formatToInr(employeeShare + employerShare)}
                    </span>
                  </div>
                )}
              </div>
            );

            return {
              contentRightTitle: formatCurrency(
                totalEmployeeShare + totalEmployerShare,
                true
              ),
              contentLeftTitle: establishmentName,
              contentLeftDescription: servicePeriodContainerWithLabel,
              onClick: () => onEstablishmentCardClick(memberId),
              alignItems: "start",
            };
          })}
        />
      </div>

      <div>
        <div
          style={{
            border: "1px solid var(--clr-grey-default)",
            borderRadius: "var(--spacing-2)",
            marginTop: "var(--spacing-8)",
            padding: "var(--spacing-3)",
            position: "relative",
            backgroundColor: "var(--clr-pure-white)",
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
            style={{
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {t("money_guru_check_faqs")}
            <CaretRight
              weight="bold"
              style={{
                marginLeft: "1px",
              }}
            />
          </button>
        </div>
      </div>
    </EpfTrackerLayout>
  );
}
