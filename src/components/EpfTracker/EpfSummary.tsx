import { Buildings } from "phosphor-react";
import {
  EpfDetailsResponse,
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

const AUTO_INCREMENT_DURATION_IN_MS = 2 * 1000;

interface EpfSummaryProps {
  epfDetails: EpfDetailsResponse;
  directlyAccessed: boolean;
  onMount?: () => void;
  onEstablishmentCardClick: (memberId: string) => void;
}

export default function EpfSummary({
  epfDetails,
  directlyAccessed,
  onMount,
  onEstablishmentCardClick,
}: EpfSummaryProps) {
  const { t } = useTranslation("common");
  const { summary, establishments } = epfDetails;

  const [isEpfDetailsIncrementEffectAlreadyShown] = useState(
    isEpfDetailsIncrementEffectShown
  );

  useEffect(() => {
    onMount?.();
  }, []);

  useEffect(() => {
    if (isEpfDetailsIncrementEffectAlreadyShown) return;
    setEpfDetailsIncrementEffectShown();
  }, [isEpfDetailsIncrementEffectAlreadyShown]);

  function getCardFooter(dateOfJoiningInEPF?: string) {
    if (!dateOfJoiningInEPF) return null;
    return (
      <p className="clr-text-secondary text-caption">
        {t("invested_since_label")}{" "}
        {format(new Date(dateOfJoiningInEPF), "dd MMM yyyy")}
      </p>
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
    <EpfTrackerLayout dispatchPopEventOnBackClick={directlyAccessed}>
      <Card
        // TODO: Ask why colors are not from design system
        backgroundColor="#061D4C"
        backgroundImageUrl={EpfSummaryCardBg.src}
        footerBackgroundColor="#EBF5FF"
        footer={getCardFooter(summary.dateOfJoiningInEPF)}
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
