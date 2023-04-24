import { useEffect } from "react";
import { useRouter } from "next/router";
import CreditReportLoading from "@/components/CreditReport/CreditReportLoading";
import CreditReportTotalAccounts from "@/components/CreditReport/CreditReportTotalAccounts";
import useFetcher from "@/hooks/useFetcher";
import { getOrFetchCreditReport } from "@/lib/credit-report";

export default function CreditReportAccountsPage() {
  const router = useRouter();
  const { isLoading, data, error } = useFetcher(getOrFetchCreditReport);

  useEffect(() => {
    if (isLoading) return;
    if (error || !data) {
      router.replace("/credit-report/summary");
    }
  }, []);

  if (isLoading) return <CreditReportLoading />;

  if (!data) return null;

  return <CreditReportTotalAccounts creditReport={data.report} />;
}
