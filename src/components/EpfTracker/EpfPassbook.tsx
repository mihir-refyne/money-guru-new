import {
  EpfEstablishment,
  EpfPassbookEntry,
  EpfPassbookEntryType,
  EpfPassbookEntryVariant,
} from "@/lib/epf";
import EpfTrackerLayout from "./EpfTrackerLayout";
import Card from "../Card";
import ListCard from "../ListCard";
import IconWrapper from "../IconWrapper";
import Separator from "../Separator";
import LabelValue from "../LabelValue";
import format from "date-fns/format";
import { Buildings, CaretRight, WhatsappLogo } from "phosphor-react";
import { formatToInr } from "@/lib/utils";
import { getEpfServicePeriodText } from "./helpers";
import NoRecordFound from "../NoRecordFound";
import Tag, { TagType } from "../Tag";
import useTranslation from "@/hooks/useTranslation";
import Modal from "../Modal";
import { useState } from "react";
interface EpfPassbookProps {
  establishmentDetails: EpfEstablishment;
}

export default function EpfPassbook({
  establishmentDetails,
}: EpfPassbookProps) {
  const { t } = useTranslation("common");
  const [isLearnMoreBottomSheetOpen, setLearnMoreBottomSheetOpen] =
    useState(false);
  const [individualTxnDetails, setIndividualTxnDetails] =
    useState<EpfPassbookEntry | null>(null);
  const totalEmployeeShare = Math.floor(
    establishmentDetails.totalEmployeeShare
  );
  // INFO: We want to show the total balance
  const totalEmployerShare = Math.floor(
    establishmentDetails.totalEmployerShare +
      establishmentDetails.totalPensionBalance
  );

  // INFO: We want to show the total balance
  const totalPensionShare = Math.floor(
    establishmentDetails.totalPensionBalance
  );

  return (
    <EpfTrackerLayout hasShare>
      <Card
        // Why these color?
        backgroundColor="#EBF5FF"
        footerBackgroundColor="#F5F7FA"
        footer={getCardFooter(establishmentDetails)}
      >
        <ListCard
          className="bg-transparent p-0 mb-6"
          items={[
            {
              leftIcon: (
                <IconWrapper circular>
                  <Buildings size={24} color="var(--clr-brand-default)" />
                </IconWrapper>
              ),
              contentLeftTitle: establishmentDetails.establishmentName,
              contentLeftDescription: `A/C: ${establishmentDetails.memberId}`,
            },
          ]}
        ></ListCard>
        <Separator separatorColor="#ADD4FF">
          <LabelValue
            label={t("employee_share_label")}
            value={totalEmployeeShare}
            formatter={formatToInr}
          />
          <LabelValue
            label={t("employer_share_label")}
            value={totalEmployerShare}
            formatter={formatToInr}
          />
        </Separator>
      </Card>

      <Card
        boxShadow="1px 0px 10px 1px rgba(18, 18, 18, 0.04)"
        border="1px solid #F0F0F0"
      >
        <Separator separatorColor="#F0F0F0">
          <LabelValue
            label={t("employee_share_label")}
            value={totalEmployeeShare}
            formatter={formatToInr}
          />
          <LabelValue
            label={t("employer_share_label")}
            value={totalEmployerShare}
            formatter={formatToInr}
          />
          <LabelValue
            // label={t("pension_share_label")}
            label="Pension share"
            value={totalPensionShare}
            formatter={formatToInr}
          />
        </Separator>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #F0F0F0",
            paddingTop: 12,
            marginTop: 16,
          }}
          role="button"
          onClick={() => setLearnMoreBottomSheetOpen(true)}
        >
          <span>Learn more</span>
          <span>
            <CaretRight />
          </span>
        </div>
      </Card>
      <div
        className="mt-6"
        style={{
          boxShadow: "1px 0px 10px 1px rgba(18, 18, 18, 0.04)",
          border: "1px solid #F0F0F0",
          borderRadius: 20,
          padding: 12,
        }}
      >
        {establishmentDetails.passbookEntries.map((entry, index) => {
          return (
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid #F0F0F0",
                alignItems: "center",
                justifyContent: "space-between",
                height: 72,
              }}
              role="button"
              onClick={() => setIndividualTxnDetails(entry)}
              key={index}
            >
              <div>
                <TransactionDateWithTag
                  transactionDate={entry.transactionDate}
                  type={entry.type}
                  variant={entry.variant}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <TransactionValue
                  type={entry.type}
                  variant={entry.variant}
                  value={entry.employerShare + entry.pensionBalance}
                />
                <CaretRight />
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        active={isLearnMoreBottomSheetOpen}
        bottomSheetOnMobile
        onClose={() => setLearnMoreBottomSheetOpen(false)}
      >
        <div style={{ border: "1px solid #F0F0F0", borderRadius: 20 }}>
          <LearnMoreSection
            icon=""
            heading="Employee and Employer Share"
            description="Both the employee and employer contribute to build retirement corpus"
            showHr
          />
          <LearnMoreSection
            icon=""
            showHr
            button={{
              label: "Pension benefits",
              onClick: () => alert("WTF"),
            }}
            heading="Pension Contribution"
            description="Provides pension benefits to employees after retirement or to their families in case of the employee’s death"
          />
          <LearnMoreSection
            icon=""
            heading="How It Works"
            description="Employee and the employer share grow your retirement savings, while a portion of the employer’s contribution ensures you receive pension benefits"
          />
        </div>
        <button
          className="btn btn-primary btn-block mt-4"
          onClick={() => setLearnMoreBottomSheetOpen(false)}
        >
          Got it
        </button>
      </Modal>

      <Modal
        active={!!individualTxnDetails}
        bottomSheetOnMobile
        onClose={() => setIndividualTxnDetails(null)}
      >
        {individualTxnDetails && (
          <div style={{ border: "1px solid #F0F0F0", borderRadius: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Date</span>
              <span>
                {format(
                  new Date(individualTxnDetails.transactionDate),
                  "dd MMM yy"
                )}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Amount</span>
              <span>
                <TransactionValue
                  type={individualTxnDetails.type}
                  variant={individualTxnDetails.variant}
                  value={
                    individualTxnDetails.employerShare +
                    individualTxnDetails.pensionBalance
                  }
                />
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Employee share</span>
              <span>{formatToInr(individualTxnDetails.employeeShare)}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Employer share</span>
              <span>{formatToInr(individualTxnDetails.employerShare)}</span>
            </div>
          </div>
        )}
        <button
          className="btn btn-primary btn-block mt-4"
          onClick={() => setIndividualTxnDetails(null)}
        >
          Got it
        </button>
      </Modal>
    </EpfTrackerLayout>
  );
}

function getCardFooter(context: {
  dateOfJoiningInEPF?: string;
  dateOfFirstTransaction?: string;
  dateOfLastTransaction?: string;
}) {
  const servicePeriodText = getEpfServicePeriodText({
    dateOfJoiningInEPF:
      context.dateOfJoiningInEPF ?? context.dateOfFirstTransaction,
    dateOfExitFromEPF: context.dateOfLastTransaction,
    prefix: "Duration: ",
    dateFormat: "dd MMM yy",
  });
  if (!servicePeriodText) return null;
  return <p className="clr-text-secondary text-caption">{servicePeriodText}</p>;
}

function getTransactionValuePrefixByType(
  type: EpfPassbookEntryType
): "+" | "-" {
  if (type === EpfPassbookEntryType.DEBIT) return "-";
  return "+";
}

function getTransactionValuePrefixAndClassName(
  type: EpfPassbookEntryType,
  variant: EpfPassbookEntryVariant
): { prefix: string; className?: string } {
  const prefix = `${getTransactionValuePrefixByType(type)} `;
  if (variant === EpfPassbookEntryVariant.INTEREST)
    return { prefix, className: "clr-info-success-default" };
  if (variant === EpfPassbookEntryVariant.CLAIM)
    return { prefix, className: "clr-info-alert-default" };
  if (variant === EpfPassbookEntryVariant.PENALTIES)
    return { prefix, className: "clr-info-error-dark" };
  if (
    variant === EpfPassbookEntryVariant.TRANSFER &&
    type === EpfPassbookEntryType.CREDIT
  )
    return { prefix, className: "clr-info-success-default" };
  if (
    variant === EpfPassbookEntryVariant.TRANSFER &&
    type === EpfPassbookEntryType.DEBIT
  )
    return { prefix, className: "clr-info-alert-default" };
  return { prefix: "" };
}

function TransactionValue(props: {
  type: EpfPassbookEntryType;
  variant: EpfPassbookEntryVariant;
  value: string | number;
}) {
  const { prefix, className } = getTransactionValuePrefixAndClassName(
    props.type,
    props.variant
  );
  return (
    <span className={className}>
      {prefix}
      {formatToInr(Number(props.value))}
    </span>
  );
}

function getTagTypeByTransactionTypeAndVariant(
  type: EpfPassbookEntryType,
  variant: EpfPassbookEntryVariant
): TagType | null {
  if (variant === EpfPassbookEntryVariant.INTEREST) return "success-light";
  if (variant === EpfPassbookEntryVariant.CLAIM) return "warning-light";
  if (variant === EpfPassbookEntryVariant.PENALTIES) return "error";
  if (
    variant === EpfPassbookEntryVariant.TRANSFER &&
    type === EpfPassbookEntryType.CREDIT
  )
    return "success-light";
  if (
    variant === EpfPassbookEntryVariant.TRANSFER &&
    type === EpfPassbookEntryType.DEBIT
  )
    return "warning-light";
  return null;
}

function TransactionDateWithTag(props: {
  transactionDate: string | number;
  type: EpfPassbookEntryType;
  variant: EpfPassbookEntryVariant;
}) {
  const { transactionDate, type, variant } = props;
  const tagType = getTagTypeByTransactionTypeAndVariant(type, variant);
  return (
    <div className="text-regular">
      <div className="text-medium clr-text-secondary">
        {format(new Date(transactionDate), "MMM yyyy")}
      </div>
      {tagType && (
        <Tag className="px-2 py-1" type={tagType} compact>
          {variant.toLowerCase()}
        </Tag>
      )}
    </div>
  );
}

function LearnMoreSection(props: {
  icon: string;
  heading: string;
  description: string;
  showHr?: boolean;
  button?: {
    label: string;
    onClick?: () => void;
  };
}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          padding: "16px 12px",
        }}
      >
        <span className="mr-2">
          <WhatsappLogo />
        </span>
        <div>
          <div style={{ fontWeight: "bold" }}>{props.heading}</div>
          <div style={{ color: "#888", marginTop: 4 }}>{props.description}</div>
          {props.button ? (
            <button
              className="btn btn-secondary m-0 p-0 mt-2"
              style={{ color: "var(--clr-brand-default)" }}
              onClick={props.button.onClick}
            >
              {props.button.label}
            </button>
          ) : null}
        </div>
      </div>
      {props.showHr ? <hr style={{ border: "1px solid #F0F0F0" }} /> : null}
    </>
  );
}
