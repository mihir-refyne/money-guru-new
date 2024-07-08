import {
  EpfEstablishment,
  EpfPassbookEntry,
  EpfPassbookEntryType,
  EpfPassbookEntryVariant,
} from "@/lib/epf";
import EpfTrackerLayout from "./EpfTrackerLayout";
import Card from "../Card";
import ListCard from "../ListCard";
import Separator from "../Separator";
import LabelValue from "../LabelValue";
import format from "date-fns/format";
import {
  CaretRight,
  WhatsappLogo,
  ArrowsClockwise,
  Wallet,
  Chats,
  PictureInPicture,
} from "phosphor-react";
import { formatToInr } from "@/lib/utils";
import {
  getEpfServicePeriodText,
  getFinancialYearsFromPassbookEntries,
} from "./helpers";
import Tag, { TagType } from "../Tag";
import useTranslation from "@/hooks/useTranslation";
import Modal from "../Modal";
import { ReactElement, useMemo, useState } from "react";
import PfPassbookBgUrl from "@/images/pf_passbook_bg.svg";
import Link from "next/link";
import CardV2 from "../CardV2";
import EpfHowToWithdrawalSummary from "@/pages/epf-tracker/epf-how-to-withdrawal-summary";

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
  const [financialYearIndex, setFinancialYearIndex] = useState<number>(0);

  const availableFinancialYears = useMemo(
    () =>
      getFinancialYearsFromPassbookEntries(
        establishmentDetails.passbookEntries
      ),
    [establishmentDetails.passbookEntries]
  );

  const filteredPassbookEntries = useMemo(() => {
    const dateFilter = availableFinancialYears[financialYearIndex];
    if (!dateFilter) return establishmentDetails.passbookEntries;
    return establishmentDetails.passbookEntries.filter((entry) => {
      const transactionDate = new Date(entry.transactionDate);
      return (
        transactionDate >= dateFilter.from && transactionDate <= dateFilter.to
      );
    });
  }, [
    establishmentDetails.passbookEntries,
    availableFinancialYears,
    financialYearIndex,
  ]);

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
      <CardV2
        border="0.5px solid var(--clr-icon-primary-light)"
        backgroundImageUrl={PfPassbookBgUrl.src}
        backgroundGradient="linear-gradient(262.79deg, #EFF6FF 12.35%, #FFFFFF 82.83%)"
        footerBackgroundColor="#FFFFFF"
        footer={getFooterWithBalance({
          totalEmployeeShare,
          totalEmployerShare,
        })}
      >
        <ListCard
          className="bg-transparent p-0 mb-6"
          items={[
            {
              contentLeftTitle: establishmentDetails.establishmentName,
              contentLeftDescription: `A/C: ${establishmentDetails.memberId}`,
            },
          ]}
        />

        <div
          style={{
            backgroundColor: "#F7F7F7",
            width: "50%",
            padding: " 0.7rem",

            borderRadius: "0.5rem",
          }}
        >
          {getCardFooter(establishmentDetails)}
        </div>
      </CardV2>

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
          <span>{t("learn_more")}</span>
          <span>
            <CaretRight />
          </span>
        </div>
      </Card>

      <h4 className="mt-4" style={{ color: "#696d70" }}>
        {t("deposits")}
      </h4>
      <div
        className="mt-2"
        style={{
          boxShadow: "1px 0px 10px 1px rgba(18, 18, 18, 0.04)",
          border: "1px solid #F0F0F0",
          borderRadius: 20,
          padding: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #F0F0F0",
            alignItems: "center",
            justifyContent: "space-between",
            height: 72,
          }}
        >
          <select
            name="filters"
            value={financialYearIndex.toString()}
            onChange={(e) =>
              setFinancialYearIndex(Number(e.currentTarget.value))
            }
            style={{
              height: "48px",
              border: "1px solid black",
              width: "100%",
              padding: "1rem",
            }}
          >
            {availableFinancialYears.map((financialYear, index) => {
              const fromDate = format(financialYear.from, "MMMM yyyy");
              const toDate = format(financialYear.to, "MMMM yyyy");
              return (
                <option
                  key={index}
                  value={index}
                >{`${fromDate} - ${toDate}`}</option>
              );
            })}
          </select>
        </div>
        {filteredPassbookEntries.map((entry, index) => {
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
        <div
          style={{
            border: "1px solid #F0F0F0",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            backgroundColor: "#fff",
            boxShadow: "0 0.25rem 0.75rem rgba(0, 0, 0, 0.1)",
          }}
        >
          {[
            {
              icon: <Wallet width={25} height={25} color="#0057B7" />,
              heading: "Employee and Employer Share",
              description:
                "Both the employee and employer contribute to build retirement corpus",
              showHr: true,
            },
            {
              icon: <PictureInPicture width={25} height={25} color="#0057B7" />,
              heading: "Pension Contribution",
              description:
                "Provides pension benefits to employees after retirement or to their families in case of the employee’s death",
              showHr: true,
              button: {
                label: "Pension benefits",
                redirectTo: "/epf-tracker/epf-pension-contribution",
              },
            },
            {
              icon: <Chats width={25} height={25} color="#0057B7" />,
              heading: "How It Works",
              description:
                "Employee and the employer share grow your retirement savings, while a portion of the employer’s contribution ensures you receive pension benefits",
              showHr: false,
            },
          ].map((section, index) => {
            const { description, heading, icon, showHr, button } = section;
            return (
              <div key={index} style={{ marginBottom: "1.25rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.625rem",
                  }}
                >
                  {/* <img
                  src={section.icon}
                  style={{
                    width: "1.5rem",
                    height: "1.5rem",
                    marginRight: "0.625rem",
                  }}
                /> */}

                  {/* <img
                    src={icon}
                    alt="Icon"
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      marginRight: "0.625rem",
                    }}
                  /> */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      background: "#EFF6FF",
                    }}
                  >
                    <span style={{ marginRight: "0.65rem" }}>{icon}</span>
                  </div>

                  <div>
                    <div
                      className="text-semibold"
                      style={{
                        color: "#000",
                      }}
                    >
                      {heading}
                    </div>
                    <div style={{ color: "#666" }}>{description}</div>
                    {section.button && (
                      <a
                        className="text-caption"
                        href={button && button.redirectTo}
                        style={{
                          color: "#007BFF",
                          textDecoration: "none",
                        }}
                      >
                        {button && button.label} &gt;
                      </a>
                    )}
                  </div>
                </div>
                {showHr && (
                  <hr
                    style={{ border: "none", borderTop: "1px solid #F0F0F0" }}
                  />
                )}
              </div>
            );
          })}
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
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "20px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            {[
              {
                label: "Date",
                value: format(
                  new Date(individualTxnDetails.transactionDate),
                  "dd MMM yy"
                ),
              },
              {
                label: "Total contribution",
                value: formatToInr(
                  individualTxnDetails.employerShare +
                    individualTxnDetails.employeeShare +
                    individualTxnDetails.pensionBalance
                ),
              },
              {
                label: "Employee share",
                value: formatToInr(individualTxnDetails.employeeShare),
              },
              {
                label: "Employer share",
                value: formatToInr(individualTxnDetails.employerShare),
              },
              {
                label: "Pension contribution",
                value: formatToInr(individualTxnDetails.pensionBalance),
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: index < 4 ? "1px solid #f0f0f0" : "none", // Remove border for the last item
                }}
              >
                <span style={{ fontSize: "14px", color: "#666" }}>
                  {item.label}
                </span>
                <span
                  style={{
                    color: "#000",
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
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

function getFooterWithBalance(context: {
  totalEmployeeShare: number;
  totalEmployerShare: number;
}) {
  const { totalEmployeeShare, totalEmployerShare } = context;
  const sum = totalEmployeeShare + totalEmployerShare;
  if (!sum) return null;
  return (
    <div className="pt-3">
      <p className="text-body"> Total Deposit (Employee + Employer Share)</p>
      <p className="text-sub-title text-medium my-3">{formatToInr(sum)}</p>
    </div>
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
  if (variant === EpfPassbookEntryVariant.CONTRIBUTION) return "general-light";
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
    redirectTo: string;
  };
}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          padding: "var(--spacing-4) (--var-spacing-3)",
        }}
      >
        <span className="mr-2">{/* <WhatsappLogo /> */}</span>
        <div>
          <div className="text-heading text-semibold">{props.heading}</div>
          <div className="text-regular" style={{ color: "#888888" }}>
            {props.description}
          </div>
          {props.button ? (
            <Link
              href={props.button.redirectTo}
              className="btn btn-secondary  m-0 p-0 mt-2"
              style={{ color: "var(--clr-brand-default)" }}
            >
              <p style={{ textDecoration: "none" }}>{props.button.label}</p>
            </Link>
          ) : null}
        </div>
      </div>
      {props.showHr ? <hr style={{ border: "1px solid #F0F0F0" }} /> : null}
    </>
  );
}
