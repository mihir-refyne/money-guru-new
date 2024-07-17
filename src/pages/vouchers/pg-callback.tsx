import { useEffect } from "react";
import useSyntheticLoader from "@/hooks/useSyntheticLoader";
import Redirect from "@/components/Redirect";
import PageLayout from "@/components/PageLayout";
import CircularSpinner from "@/components/CircularSpinner";
import { useRouter } from "next/router";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";

const DELAY_IN_MS = 10 * 1000;

// This will be a blank page to wait for 3-5 seconds after PG redirect
export default function VoucherPaymentGatewayCallback() {
  const router = useRouter();
  const { isLoading, setIsLoading } = useSyntheticLoader(true, DELAY_IN_MS);

  const voucherName = router.query.voucher_name?.toString();
  const linkId = router.query.link_id?.toString();

  useEffect(() => {
    setIsLoading(true);
    logAnalyticsEvent(
      ["mixpanel"],
      AnalyticEvent.VOUCHER_MARKETPLACE_LANDING_PAGE_PG_CALLBACK_RECEIVED,
      {
        voucher_name: voucherName,
        link_id: linkId,
      }
    );
  }, []);

  if (isLoading)
    return (
      <PageLayout hasNavbar={false} alignContentCenter>
        <CircularSpinner />
        <h5 className="text-heading-small">Waiting for payment confirmation</h5>
      </PageLayout>
    );

  // TODO: What will happen if allocation takes more time?

  return (
    <Redirect
      to={`/vouchers/${voucherName ?? "SWIGGY_ONE"}`}
      query={{ pg_callback: "true" }}
      replace={true}
      preserveCurrentQueryParams={false}
    />
  );
}
