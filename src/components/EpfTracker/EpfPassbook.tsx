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
import Table, { TableColumn } from "../Table";
import format from "date-fns/format";
import { Buildings } from "phosphor-react";
import { formatToInr } from "@/lib/utils";
import { getEpfServicePeriodText } from "./helpers";
import NoRecordFound from "../NoRecordFound";
import Tag, { TagType } from "../Tag";

const TransactionTableColumns: TableColumn<EpfPassbookEntry>[] = [
  {
    field: "transactionDate",
    label: "Transaction Date",
    alignment: "left",
    renderValue: (transactionDate, rowData) => (
      <TransactionDateWithTag
        transactionDate={transactionDate}
        type={rowData.type}
        variant={rowData.variant}
      />
    ),
  },
  {
    field: "employeeShare",
    label: "Employee",
    alignment: "right",
    renderValue: (value, rowData) => (
      <TransactionValue
        type={rowData.type}
        variant={rowData.variant}
        value={value}
      />
    ),
  },
  {
    field: "employerShare",
    label: "Employer",
    alignment: "right",
    renderValue: (_, rowData) => (
      <TransactionValue
        type={rowData.type}
        variant={rowData.variant}
        value={rowData.employerShare + rowData.pensionBalance}
      />
    ),
  },
];

interface EpfPassbookProps {
  establishmentDetails: EpfEstablishment;
}

export default function EpfPassbook({
  establishmentDetails,
}: EpfPassbookProps) {
  const totalEmployeeShare = Math.floor(
    establishmentDetails.totalEmployeeShare
  );
  // INFO: We want to show the total balance
  const totalEmployerShare = Math.floor(
    establishmentDetails.totalEmployerShare +
      establishmentDetails.totalPensionBalance
  );

  return (
    <EpfTrackerLayout>
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
            label="Employee Share"
            value={totalEmployeeShare}
            formatter={formatToInr}
          />
          <LabelValue
            label="Employer Share"
            value={totalEmployerShare}
            formatter={formatToInr}
          />
        </Separator>
      </Card>
      <div className="mt-6">
        <Table
          columns={TransactionTableColumns}
          data={establishmentDetails.passbookEntries}
          noDataView={<NoRecordFound />}
        />
      </div>
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
      <span className="text-medium clr-text-secondary">
        {format(new Date(transactionDate), "dd MMM yyyy")}
      </span>
      {tagType && (
        <Tag className="ml-1" type={tagType} compact>
          {variant.toLowerCase()}
        </Tag>
      )}
    </div>
  );
}
