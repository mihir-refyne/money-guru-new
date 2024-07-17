import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import useFetcher from "@/hooks/useFetcher";
import {
  getVoucherUIState,
  initiateVoucherPurchase,
} from "@/lib/core/voucher-marketplace";
import { useRouter } from "next/router";
import useMutation from "@/hooks/useMutation";
import VoucherLandingPage from "@/components/Voucher/VoucherLandingPage";
import VoucherUIConfigData from "../../../data/voucher_ui_config.json";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { APP_BASE_URL } from "@/constants";
import VoucherPageSkeletonLoader from "@/components/Voucher/VoucherPageSkeletonLoader";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import { FetcherError } from "@/lib/fetcher";
import VoucherFinished from "@/components/Voucher/VoucherFinished";
import { dispatchDataToNativePlatform } from "@/lib/webview";

interface VoucherUIConfig {
  pageTitle: string;
  logoUrl: string;
  cardBuyTitle: string;
  cardBuyDescription: string;
  cardBuyCtaText: string;
  cardBuySignupCtaText: string;
  cardRedeemTitle: string;
  cardRedeemDescription: string;
  cardRedeemCtaText: string;
  payVia: "EWA" | "PG";
  returnDirectlyPostSignup: boolean;
  details: Array<string>;
  redeemSteps: Array<string>;
  termsAndConditionsExternalUrl?: string;
  termsAndConditions: Array<string>;
}

export const getStaticPaths: GetStaticPaths<{ voucherName: string }> = ({
  locales = [],
}) => {
  const configObject: Record<string, VoucherUIConfig> =
    VoucherUIConfigData as Record<string, VoucherUIConfig>;
  const AVAILABLE_VOUCHERS = Object.keys(configObject);
  const paths = AVAILABLE_VOUCHERS.flatMap((voucher) => {
    return locales.map((locale) => {
      return {
        params: {
          voucherName: voucher,
        },
        locale,
      };
    });
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  { uiConfig: VoucherUIConfig | null; voucherName?: string },
  { voucherName: string }
> = async (context) => {
  const configObject: Record<string, VoucherUIConfig> =
    VoucherUIConfigData as Record<string, VoucherUIConfig>;
  const voucherName = context.params?.voucherName;
  const uiConfig = voucherName ? configObject[voucherName] ?? null : null;
  return {
    props: {
      uiConfig: uiConfig,
      voucherName,
    },
  };
};

export default function VoucherPage({
  uiConfig,
  voucherName,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const routedFromPGCallback = router.query.pg_callback?.toString() === "true";
  const {
    isLoading,
    data: voucherState,
    error,
    refetch: refetchVoucherState,
  } = useFetcher(() => getVoucherUIState(voucherName));
  const {
    isLoading: purchaseInitiateLoading,
    data: purchaseInitiateResponse,
    error: purchaseInitiateError,
    mutate: initiatePurchase,
  } = useMutation(initiateVoucherPurchase);

  useEffect(() => {
    const errorObj = (purchaseInitiateError ?? error) as FetcherError<{
      message?: string;
    }> | null;
    if (errorObj?.message) {
      toast.error(errorObj?.message, { id: "error" });
    }
  }, [error, purchaseInitiateError]);

  useEffect(() => {
    if (purchaseInitiateResponse?.payment_link) {
      logAnalyticsEvent(
        ["mixpanel"],
        AnalyticEvent.VOUCHER_MARKETPLACE_LANDING_PAGE_REDIRECTING_TO_PG,
        {
          voucher_name: voucherName,
          voucher_state: voucherState?.status,
        }
      );
      router.push(purchaseInitiateResponse.payment_link);
    }
    if (purchaseInitiateResponse?.allotment) {
      refetchVoucherState(true).then(() => {
        toast.success("Success!", { id: "success" });
      });
    }
  }, [purchaseInitiateResponse]);

  useEffect(() => {
    if (!voucherState) return;
    if (routedFromPGCallback && voucherState.status === "VOUCHER_ALLOCATED") {
      toast.success("Success!", { id: "success" });
    }
    if (routedFromPGCallback && voucherState.status === "VOUCHER_AVAILABLE") {
      // This means voucher is not allocated yet after PG callback
      toast.error("Voucher allocation failed, please try after sometime", {
        id: "error",
      });
    }
  }, [voucherState]);

  function handleOnMount() {
    logAnalyticsEvent(
      ["mixpanel"],
      AnalyticEvent.VOUCHER_MARKETPLACE_LANDING_PAGE,
      {
        voucher_name: voucherName,
        voucher_state: voucherState?.status,
        routed_from_pg_callback: routedFromPGCallback,
        pay_via: uiConfig?.payVia
      },
      { triggerEvenIfUserContextIsAbsent: true }
    );
  }

  function handleCtaClick() {
    if (!voucherState || !voucherName) return;
    logAnalyticsEvent(
      ["mixpanel"],
      AnalyticEvent.VOUCHER_MARKETPLACE_LANDING_PAGE_CTA_CLICKED,
      {
        voucher_name: voucherName,
        voucher_state: voucherState?.status,
        pay_via: uiConfig?.payVia,
      },
      { triggerEvenIfUserContextIsAbsent: true }
    );
    if (voucherState.status === "UNAUTHENTICATED") {
      const returnDirectlyPostSignup = !!uiConfig?.returnDirectlyPostSignup
      const queryParams = new URLSearchParams({
        utm_source: "voucher_marketplace_landing_page",
        utm_campaign: voucherName.toLowerCase(),
        utm_medium: "web_link",
      });
      if (returnDirectlyPostSignup) {
        const returnURL = location.href;
        queryParams.set("preventAlternateSignUp", "true");
        queryParams.set("afterAuthRedirectBackToUrl", returnURL);
      }
      const url = `${APP_BASE_URL}/#/loginRegister?${queryParams.toString()}`;
      router.push(url);
    }
    if (voucherState.status === "VOUCHER_AVAILABLE" && voucherName) {
      initiatePurchase(voucherName, uiConfig?.payVia);
    }
  }

  function handleBackToHome() {
    dispatchDataToNativePlatform({
      type: "POP",
    });
    router.replace(APP_BASE_URL);
  }

  if (isLoading)
    return (
      <VoucherPageSkeletonLoader navbarText={uiConfig?.pageTitle ?? "Refyne"} />
    );

  if (
    !uiConfig ||
    !voucherState ||
    voucherState.status === "VOUCHER_UNAVAILABLE"
  ) {
    return (
      <VoucherFinished
        pageTitle={uiConfig?.pageTitle}
        onBackToHomeClick={handleBackToHome}
      />
    );
  }

  // TODO: Refactor and move to a function
  const heroCardTitle =
    voucherState.status === "VOUCHER_ALLOCATED"
      ? uiConfig.cardRedeemTitle
      : uiConfig.cardBuyTitle;
  const heroCardDescription =
    voucherState.status === "VOUCHER_ALLOCATED"
      ? uiConfig.cardRedeemDescription
      : uiConfig.cardBuyDescription;
  const heroCardCtaText =
    voucherState.status === "VOUCHER_ALLOCATED"
      ? uiConfig.cardRedeemCtaText
      : voucherState.status === "UNAUTHENTICATED"
      ? uiConfig.cardBuySignupCtaText
      : uiConfig.cardBuyCtaText;

  return (
    <VoucherLandingPage
      pageTitle={uiConfig.pageTitle}
      belowNavbarText="Exclusive offer on Refyne"
      showBelowNavbarText={voucherState.status !== "VOUCHER_ALLOCATED"}
      heroCardImageUrl={uiConfig.logoUrl}
      heroCardTitle={heroCardTitle}
      heroCardDescription={heroCardDescription}
      heroCardCtaText={heroCardCtaText}
      heroCardCtaLoading={isLoading || purchaseInitiateLoading}
      voucherCode={
        voucherState.status === "VOUCHER_ALLOCATED"
          ? voucherState.allotmentDetails.voucher_code
          : undefined
      }
      onHeroCtaClick={handleCtaClick}
      onBackToHomeClick={handleBackToHome}
      voucherDetails={uiConfig.details}
      redeemSteps={uiConfig.redeemSteps}
      canRedeem={voucherState.status === "VOUCHER_ALLOCATED"}
      termsAndConditions={uiConfig.termsAndConditions}
      termsAndConditionsExternalUrl={uiConfig.termsAndConditionsExternalUrl}
      onMount={handleOnMount}
    />
  );
}
