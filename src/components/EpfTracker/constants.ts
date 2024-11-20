import { EpfFetchIdentifier } from "@/lib/epf";
import { EpfFetchErrorModalContentProps } from "./EpfFetchErrorModalContent";
import { redirectToFaq } from "./helpers";
import toast from "react-hot-toast";
import { logAnalyticsEvent } from "@/lib/analytics";
import { AnalyticEvent } from "@/lib/analytics/events";
import { ReactNode } from "react";

const INFO_BLUE_ICON_URL = "/assets/images/info-blue-icon.svg";
const WARNING_YELLOW_ICON_URL = "/assets/images/dark-yellow-warning.svg";

type ServerErrorCodeToResponseModalMapType = Record<
  EpfFetchIdentifier,
  Partial<Record<string, EpfFetchErrorModalContentProps>>
>;

export const SERVICE_UNAVAILABLE_COMMON_MODAL: EpfFetchErrorModalContentProps =
  {
    illustrationUrl: WARNING_YELLOW_ICON_URL,
    title: "epfo_portal_down_title",
    description: "epfo_portal_down_description",
    closable: true,
    primaryCta: {
      label: "epfo_portal_down_cta",
    },
  };

export interface SummaryStep {
  imgURL?: string;
  icon?: ReactNode;
  iconBackgroundColor?: string;
  label?: string;
  desc?: string;
  descFooterText?: string;
  descFooterIcon?: ReactNode;
  hasDescFooter?: boolean;
  hasBottomBorder?: boolean;
  hideIcon?: boolean;
}

export interface HowToWithdrawPfSummaryType {
  heading: string;
  summarySteps: Array<SummaryStep>;
}

const NO_RECORDS_FOUND_COMMON_MODAL: EpfFetchErrorModalContentProps = {
  illustrationUrl: WARNING_YELLOW_ICON_URL,
  title: "epfo_no_record_title",
  description: "epfo_no_record_description",
  closable: true,
  primaryCta: {
    label: "epfo_no_record_cta",
    url: "/epf-tracker/start?identifier=uan",
  },
  secondaryCta: {
    label: "epfo_no_record_secondary_cta",
    onClick: redirectToFaq,
  },
};

export const EpfTrackerServerErrorCodeToResponseModalMapPreOtp: ServerErrorCodeToResponseModalMapType =
  {
    mobileNo: {
      E74006: {
        illustrationUrl: INFO_BLUE_ICON_URL,
        title: "epfo_invalid_input_title",
        closable: true,
        description: "epfo_invalid_input_description",

        primaryCta: {
          label: "epfo_invalid_input_cta",
        },
      },
      E74001: NO_RECORDS_FOUND_COMMON_MODAL,
      E74002: {
        illustrationUrl: WARNING_YELLOW_ICON_URL,
        closable: true,
        title: "epfo_limit_reached_title",
        description: "epfo_limit_reached_description",
        primaryCta: {
          label: "epfo_limit_reached_cta",
          url: "/epf-tracker/start?identifier=uan",
        },
      },
      E74003: {
        illustrationUrl: WARNING_YELLOW_ICON_URL,
        title: "epfo_multiple_uan_detected_title",
        description: "epfo_multiple_uan_detected_description",
        closable: true,
        primaryCta: {
          label: "epfo_multiple_uan_detected_cta",
          url: "/epf-tracker/start?identifier=uan",
        },
        secondaryCta: {
          label: "epfo_multiple_uan_detected_secondary_cta",
          onClick: redirectToFaq,
        },
      },
      E74005: SERVICE_UNAVAILABLE_COMMON_MODAL,
    },
    uan: {
      E74001: {
        illustrationUrl: WARNING_YELLOW_ICON_URL,
        title: "epfo_no_record_title",
        description: "epfo_no_record_description_uan",
        closable: true,
        primaryCta: {
          label: "epfo_no_record_cta_uan",
          onClick: redirectToFaq,
        },
      },
      E74005: SERVICE_UNAVAILABLE_COMMON_MODAL,
    },
  };

export const EpfTrackerServerErrorCodeToResponseModalMapPostOtp: ServerErrorCodeToResponseModalMapType =
  {
    mobileNo: {
      E74006: {
        illustrationUrl: INFO_BLUE_ICON_URL,
        title: "epfo_otp_issue_title",
        description: "epfo_otp_issue_description",
        closable: true,
        primaryCta: {
          label: "epfo_otp_issue_cta",
        },
      },
      E74001: NO_RECORDS_FOUND_COMMON_MODAL,
      E74002: {
        illustrationUrl: WARNING_YELLOW_ICON_URL,
        title: "epfo_logged_in_elsewhere_title",
        description: "epfo_logged_in_elsewhere_description",
        closable: true,
        primaryCta: {
          label: "epfo_logged_in_elsewhere_cta",
        },
      },
      E74005: SERVICE_UNAVAILABLE_COMMON_MODAL,
    },
    uan: {
      E74005: SERVICE_UNAVAILABLE_COMMON_MODAL,
    },
  };

export interface PermittedClaimReasonType extends HowToWithdrawPfSummaryType {}
