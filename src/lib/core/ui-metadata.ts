export interface TextMetadata {
  text: string;
  templateContext?: Record<string, any>;
}

export interface UiMetadata {
  hideInUi?: boolean;
  header?: TextMetadata;
  description?: TextMetadata;
  imageUrl?: string;
  onClick?: RedirectDetails;
}

export interface AppModalConfig {
  header?: string;
  desc?: string;
  CTAText?: string;
  icon?: string;
  onClick?: Omit<RedirectDetails, "appModal">;
  image?: {
    url: string;
  };
}

export interface RedirectDetails {
  externalUrl?: string;
  webViewUrl?: string;
  webViewAppBarHidden?: boolean;
  screen?: string;
  appModal?: AppModalConfig;
}

export const ScreenToAppRouteIdMap: Record<string, string | undefined> = {
  AMOUNT_TO_WITHDRAW: "withdrawAmountPage",
  USER_TXN_DETAILS: "userTxnDetails",
};
