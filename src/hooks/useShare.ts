import { useMemo, useState } from "react";
import { copyText } from "@/lib/clipboard";
import {
  ShareContentWithImageUrls,
  canShare,
  canShareImage,
  shareToNativePlatformWithImageUrls,
  shareWithImageUrls,
  share as webShare,
} from "@/lib/share";
import toast from "react-hot-toast";

type ShareMedium = "NATIVE_PLATFORM" | "WEB_SHARE" | "WEB_SHARE_WITH_IMAGE";
type ShareMediumWithCopy = ShareMedium | "CLIPBOARD_COPY";

type ShareResponse<MediumType> =
  | {
      success: true;
      medium: MediumType;
    }
  | {
      success: false;
    };

interface UseShareProps {
  isWebview?: boolean;
}

interface ShareOrClipboardCopyConfig {
  showToastOnClipboardCopy?: boolean;
  clipboardCopyToastMessage?: string;
}

interface UseShareResponse {
  shareInProgress: boolean;
  share(
    payload: ShareContentWithImageUrls
  ): Promise<ShareResponse<ShareMedium>>;
  shareOrClipboardCopy(
    payload: ShareContentWithImageUrls,
    config?: ShareOrClipboardCopyConfig
  ): Promise<ShareResponse<ShareMediumWithCopy>>;
}

function getSupportedObject(context: {
  isWebview: boolean;
}): Record<ShareMedium, boolean> | null {
  const { isWebview } = context;

  // INFO: We are assuming native share is supported in webview
  const isNativePlatformShareSupported = isWebview;

  try {
    const imageShareAvailable = canShareImage();
    if (imageShareAvailable)
      return {
        WEB_SHARE: true,
        WEB_SHARE_WITH_IMAGE: true,
        NATIVE_PLATFORM: isNativePlatformShareSupported,
      };

    const canShareText = canShare({ text: "Hello World" });
    if (canShareText)
      return {
        WEB_SHARE: true,
        WEB_SHARE_WITH_IMAGE: false,
        NATIVE_PLATFORM: isNativePlatformShareSupported,
      };

    return {
      WEB_SHARE: false,
      WEB_SHARE_WITH_IMAGE: false,
      NATIVE_PLATFORM: isNativePlatformShareSupported,
    };
  } catch (_) {
    return null;
  }
}

function handleWebShareResponse<
  MediumType extends ShareMedium | ShareMediumWithCopy
>(success: boolean | undefined, medium: MediumType): ShareResponse<MediumType> {
  if (!success) {
    return {
      success: false,
    };
  }
  return {
    success: true,
    medium,
  };
}

export function useShare({
  isWebview = false,
}: UseShareProps): UseShareResponse {
  const supported = useMemo(
    () => getSupportedObject({ isWebview }),
    [isWebview]
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function share(
    payload: ShareContentWithImageUrls
  ): Promise<ShareResponse<ShareMedium>> {
    try {
      setIsLoading(true);
      if (supported?.NATIVE_PLATFORM) {
        await shareToNativePlatformWithImageUrls(payload);
        return {
          success: true,
          medium: "NATIVE_PLATFORM",
        };
      }
      if (supported?.WEB_SHARE_WITH_IMAGE && payload.imageUrls.length) {
        const success = await shareWithImageUrls(payload);
        return handleWebShareResponse<ShareMedium>(
          success,
          "WEB_SHARE_WITH_IMAGE"
        );
      }
      if (supported?.WEB_SHARE && payload.text) {
        const success = await webShare(payload);
        return handleWebShareResponse<ShareMedium>(success, "WEB_SHARE");
      }
      return {
        success: false,
      };
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function shareOrClipboardCopy(
    payload: ShareContentWithImageUrls,
    config: ShareOrClipboardCopyConfig = {}
  ): Promise<ShareResponse<ShareMediumWithCopy>> {
    const shareResponse = await share(payload);
    if (shareResponse.success) return shareResponse;
    const {
      showToastOnClipboardCopy = false,
      clipboardCopyToastMessage = "Copied to clipboard",
    } = config;
    const clipboardCopyText = [payload.text, payload.url]
      .filter(Boolean)
      .join(" ");
    copyText(clipboardCopyText);
    if (showToastOnClipboardCopy) {
      toast.success(clipboardCopyToastMessage, {
        id: "copy_to_clipboard_success",
      });
    }
    return handleWebShareResponse<ShareMediumWithCopy>(true, "CLIPBOARD_COPY");
  }

  return {
    shareInProgress: isLoading,
    share,
    shareOrClipboardCopy,
  };
}
