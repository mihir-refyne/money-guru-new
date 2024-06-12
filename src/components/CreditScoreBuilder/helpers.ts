import { dispatchDataToNativePlatform } from "@/lib/webview";
import {
  addQueryInUrl,
  addUserTokenInUrlIfRequired,
} from "@/pages/virtual-rewards-event";
import { NextRouter } from "next/router";

export function getRouteHandler({
  isRefyneWebview,
  navigateTo,
  router,
  webviewRoute,
  idToken,
  nativeDispatchType = "ROUTE_TO_SCREEN",
}: {
  navigateTo: string | undefined;
  webviewRoute?: string;
  router: NextRouter;
  isRefyneWebview: boolean;
  idToken?: string;
  nativeDispatchType?: "ROUTE_TO_SCREEN" | "ROUTE_TO_SCREEN_ONLY";
}) {
  return () => {
    if (isRefyneWebview && webviewRoute) {
      return dispatchDataToNativePlatform({
        type: nativeDispatchType,
        body: {
          screenName: webviewRoute,
        },
      });
    }
    if (navigateTo) {
      const navigateToWithTokenIfRequired = addUserTokenInUrlIfRequired(
        navigateTo,
        isRefyneWebview,
        idToken
      );
      const navigateToWithTokenIfRequiredWithLocale = addQueryInUrl(
        navigateToWithTokenIfRequired,
        "locale",
        router.locale
      );
      router.push(navigateToWithTokenIfRequiredWithLocale);
    }
  };
}
