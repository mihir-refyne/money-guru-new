import { EpfFetchIdentifier } from "@/lib/epf";
import { EpfFetchErrorModalContentProps } from "./EpfFetchErrorModalContent";

const INFO_BLUE_ICON_URL = "/assets/images/info-blue-icon.svg";
const WARNING_YELLOW_ICON_URL = "/assets/images/warn-circle-yellow-icon.svg";

// const EpfTrackerServerErrorCodeMap = {
//   E74001: "NO_RECORDS_FOUND",
//   E74002: "MAX_RETRIES_EXCEEDED",
//   E74003: "MULTIPLE_RECORDS_EXISTS",
//   E74004: "REQUEST_EXPIRED",
//   E74005: "SERVICE_UNAVAILABLE",
//   E74006: "INVALID_INPUT",
// } as const;

// {
//     '102': "INVALID_INPUT",
//     '103': "NO_RECORDS_FOUND",
//     '104': "MAX_RETRIES_EXCEEDED",
//     '106': "MULTIPLE_RECORDS_EXISTS",
//     '503': "SERVICE_UNAVAILABLE"
// }

type ServerErrorCodeToResponseModalMapType = Record<
  EpfFetchIdentifier,
  Partial<Record<string, EpfFetchErrorModalContentProps>>
>;

const SERVICE_UNAVAILABLE_COMMAN_MODAL: EpfFetchErrorModalContentProps = {
  illustrationUrl: WARNING_YELLOW_ICON_URL,
  title: "epfo_portal_down_title",
  description: "epfo_portal_down_description",
  primaryCta: {
    label: "epfo_portal_down_cta",
  },
};

const NO_RECORDS_FOUND_COMMON_MODAL: EpfFetchErrorModalContentProps = {
  illustrationUrl: INFO_BLUE_ICON_URL,
  title: "epfo_no_record_title",
  description: "epfo_no_record_description",
  primaryCta: {
    label: "epfo_no_record_cta",
  },
};

export const EpfTrackerServerErrorCodeToResponseModalMapPreOtp: ServerErrorCodeToResponseModalMapType =
  {
    mobileNo: {
      E74006: {
        illustrationUrl: INFO_BLUE_ICON_URL,
        title: "epfo_invalid_input_title",
        description: "epfo_invalid_input_description",
        primaryCta: {
          label: "epfo_invalid_input_cta",
        },
      },
      E74001: NO_RECORDS_FOUND_COMMON_MODAL,
      E74002: {
        illustrationUrl: WARNING_YELLOW_ICON_URL,
        title: "epfo_limit_reached_title",
        description: "epfo_limit_reached_description",
        primaryCta: {
          label: "epfo_limit_reached_cta",
        },
      },
      E74003: {
        illustrationUrl: INFO_BLUE_ICON_URL,
        title: "epfo_multiple_uan_detected_title",
        description: "epfo_multiple_uan_detected_description",
        primaryCta: {
          label: "epfo_multiple_uan_detected_cta",
          url: "/epf-tracker/start?identifier=uan",
        },
      },
      E74005: SERVICE_UNAVAILABLE_COMMAN_MODAL,
    },
    uan: {
      E74001: {
        illustrationUrl: INFO_BLUE_ICON_URL,
        title: "epfo_no_record_title",
        description: "epfo_no_record_description_uan",
        primaryCta: {
          label: "epfo_no_record_cta_uan",
        },
      },
      E74005: SERVICE_UNAVAILABLE_COMMAN_MODAL,
    },
  };

export const EpfTrackerServerErrorCodeToResponseModalMapPostOtp: ServerErrorCodeToResponseModalMapType =
  {
    mobileNo: {
      E74006: {
        illustrationUrl: INFO_BLUE_ICON_URL,
        title: "epfo_otp_issue_title",
        description: "epfo_otp_issue_description",
        primaryCta: {
          label: "epfo_otp_issue_cta",
        },
      },
      E74001: NO_RECORDS_FOUND_COMMON_MODAL,
      E74002: {
        illustrationUrl: WARNING_YELLOW_ICON_URL,
        title: "epfo_logged_in_elsewhere_title",
        description: "epfo_logged_in_elsewhere_description",
        primaryCta: {
          label: "epfo_logged_in_elsewhere_cta",
        },
      },
      E74005: SERVICE_UNAVAILABLE_COMMAN_MODAL,
    },
    uan: {
      E74005: SERVICE_UNAVAILABLE_COMMAN_MODAL,
    },
  };
