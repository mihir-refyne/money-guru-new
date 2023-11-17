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
import EpfSummaryCardBg from "@/images/epf_summary_card_bg.svg";
import useTranslation from "@/hooks/useTranslation";
import { ArrowsClockwise, Buildings } from "phosphor-react";
import toast from "react-hot-toast";

const AUTO_INCREMENT_DURATION_IN_MS = 2 * 1000;
const MIN_REFETCH_DISABLED_CLICK_COUNT_TO_SHOW_INFO = 3;

interface EpfSummaryProps {
  epfDetails: EpfDetailsResponse;
  directlyAccessed: boolean;
  onMount?: () => void;
  onEstablishmentCardClick: (memberId: string) => void;
  onRefetchClick?: (identifier: EpfFetchIdentifier, value?: string) => void;
}

export default function EpfSummary({
  epfDetails,
  directlyAccessed,
  onMount,
  onEstablishmentCardClick,
  onRefetchClick,
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p className="clr-text-secondary text-caption">
          {t("last_updated")} {format(new Date(lastFetchedAt), "dd MMM yy")}
        </p>
        <button
          className={`${
            refetchEnabled ? "clr-brand-default" : "clr-text-tertiary"
          } text-medium flex-center`}
          onClick={onRefetchClick}
        >
          <span className="mr-1">{t("epfo_refresh_cta")}</span>
          <ArrowsClockwise />
        </button>
      </div>
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
        backgroundColor="#061D4C"
        backgroundImageUrl={EpfSummaryCardBg.src}
        footerBackgroundColor="#EBF5FF"
        footer={getCardFooter(
          metadata.fetchedAt,
          isRefetchPossible,
          handleRefetchClick
        )}
      >
        <div className="mb-4">
          <LabelValue
            type="light"
            label={t("pf_balance_label")}
            labelTextVariant="body_regular"
            value={totalBalanceWithAutoIncrement}
            formatter={formatToInr}
            valueTextVariant="title_semibold"
          />
        </div>
        <Separator separatorColor="var(--clr-pure-white)">
          <LabelValue
            type="light"
            label={t("employee_share_label")}
            value={totalEmployeeShareWithAutoIncrement}
            formatter={formatToInr}
          />
          <LabelValue
            type="light"
            label={t("employer_share_label")}
            value={totalEmployerShareWithAutoIncrement}
            formatter={formatToInr}
          />
        </Separator>
      </Card>
      <h2 className="text-body text-semibold mt-6 mb-4">
        {t("all_employers_label")} ({establishments.length})
      </h2>
      <div>
        {/* TODO: Check the Array order */}
        {establishments.map((establishment) => {
          const {
            memberId,
            establishmentName,
            dateOfJoiningInEPF,
            dateOfFirstTransaction,
            dateOfLastTransaction,
          } = establishment;
          const servicePeriodText =
            getEpfServicePeriodText({
              dateOfJoiningInEPF: dateOfJoiningInEPF ?? dateOfFirstTransaction,
              dateOfExitFromEPF: dateOfLastTransaction,
            }) ?? "";
          return (
            <ListCard
              key={memberId}
              className="mb-4"
              items={[
                {
                  leftIcon: (
                    <IconWrapper circular>
                      <Buildings size={24} color="var(--clr-brand-default)" />
                    </IconWrapper>
                  ),
                  contentLeftTitle: establishmentName,
                  contentLeftDescription: servicePeriodText,
                  onClick: () => onEstablishmentCardClick(memberId),
                },
              ]}
            />
          );
        })}
      </div>
      <InfoCard>{t("epf_info_disclaimer")}</InfoCard>
    </EpfTrackerLayout>
  );
}
