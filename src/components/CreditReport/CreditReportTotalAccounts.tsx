import { useMemo } from "react";
import CreditReportLayout from "./CreditReportLayout";
import { CreditCard, FileText } from "phosphor-react";
import ListCard, { ListCardItemProps } from "../ListCard";
import NoRecordFound from "../NoRecordFound";
import {
  CreditCardAccounts,
  CreditReport,
  LoanAccounts,
} from "@/lib/credit-report";
import { formatToInr } from "@/lib/utils";
import useTranslation from "@/hooks/useTranslation";

interface CreditReportTotalAccountsProps {
  creditReport: CreditReport;
}

export default function CreditReportTotalAccounts({
  creditReport,
}: CreditReportTotalAccountsProps) {
  const { t } = useTranslation("common");
  const { loanAccounts, creditCardAccounts } = creditReport.retailAccountsInfo;

  const listCardPropsForLoanAccounts = useMemo<ListCardItemProps[]>(() => {
    return loanAccounts.map(getLoanAccountsListCardPropsFromAccount);
  }, [loanAccounts]);

  const listCardPropsForCreditCardAccounts = useMemo<
    ListCardItemProps[]
  >(() => {
    return creditCardAccounts.map(
      getCreditCardAccountsListCardPropsFromAccount
    );
  }, [creditCardAccounts]);

  return (
    <CreditReportLayout navbarText={t("total_accounts_label")}>
      <h3 className="text-heading clr-text-secondary">
        {t("credit_cards_label")}
      </h3>
      {listCardPropsForCreditCardAccounts.length > 0 ? (
        <ListCard className="mt-4" items={listCardPropsForCreditCardAccounts} />
      ) : (
        <NoRecordFound />
      )}
      <h3 className="text-heading clr-text-secondary mt-4">
        {t("loans_label")}
      </h3>
      {listCardPropsForLoanAccounts.length > 0 ? (
        <ListCard className="mt-4" items={listCardPropsForLoanAccounts} />
      ) : (
        <NoRecordFound />
      )}
    </CreditReportLayout>
  );
}

function getLoanAccountsListCardPropsFromAccount(
  accounts: LoanAccounts
): ListCardItemProps {
  const { institution, accountType, active } = accounts;
  return {
    leftIcon: <FileText size={32} color="var(--clr-brand-default)" />,
    contentLeftTitle: institution,
    contentLeftDescription: accountType,
    contentRightDescription: active ? "Active" : "Closed",
    contentRightDescriptionFontColor: active
      ? "var(--clr-info-success-default)"
      : "var(--clr-info-error-default)",
  };
}

function getCreditCardAccountsListCardPropsFromAccount(
  accounts: CreditCardAccounts
): ListCardItemProps {
  const { institution, creditLimit, active } = accounts;
  return {
    leftIcon: <CreditCard size={32} color="var(--clr-brand-default)" />,
    contentLeftTitle: institution,
    contentLeftDescription: formatToInr(creditLimit).toString(),
    contentRightDescription: active ? "Active" : "Closed",
    contentRightDescriptionFontColor: active
      ? "var(--clr-info-success-default)"
      : "var(--clr-info-error-default)",
  };
}
