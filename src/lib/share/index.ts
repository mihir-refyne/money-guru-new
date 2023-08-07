import { dispatchDataToNativePlatform } from "../webview";

interface ShareContent {
  files?: File[];
  text?: string;
  title?: string;
  url?: string;
}

export type ShareContentWithImageUrls = Omit<ShareContent, "files"> & {
  imageUrls: string[];
};

export async function getFileByRemoteImageUrl(url: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], getFileNameFromUrl(url), {
    type: blob.type,
  });
  return file;
}

export async function getDataUrlByRemoteImageUrl(
  url: string
): Promise<string | null> {
  if (url.startsWith("data:")) return url;
  if (!FileReader) return null;
  const file = await getFileByRemoteImageUrl(url);
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      resolve(null);
    };
    reader.readAsDataURL(file);
  });
}

function getFileNameFromUrl(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 1];
}

export async function share(payload: ShareContent) {
  if (!canShare(payload)) return false;
  try {
    await navigator?.share(payload);
    return true;
  } catch (error) {
    return false;
  }
}

export async function shareWithImageUrls(
  payload: Omit<ShareContent, "files"> & { imageUrls: string[] }
) {
  const { imageUrls, ...rest } = payload;
  try {
    const files = await Promise.all(imageUrls.map(getFileByRemoteImageUrl));
    return share({ files, ...rest });
  } catch (e: any) {
    if (e?.name === "NotAllowedError") {
      share(rest);
    }
  }
}

export async function shareToNativePlatformWithImageUrls(
  payload: Omit<ShareContent, "files"> & { imageUrls?: string[] }
) {
  const { imageUrls, ...rest } = payload;
  if (!imageUrls) {
    return dispatchDataToNativePlatform({
      type: "WHATSAPP_SHARE",
      body: rest,
    });
  }
  // INFO: Only supporting one image for now
  const imageDataUrl =
    imageUrls[0] && (await getDataUrlByRemoteImageUrl(imageUrls[0]));
  const body = { imageDataUrl, ...rest };
  return dispatchDataToNativePlatform({
    type: "WHATSAPP_SHARE",
    body,
  });
}

export function isWebShareApiSupported() {
  return !!window?.navigator?.share;
}

function getDummyImageFile(): File {
  const imageDataUrl =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
  return dataURLtoFile(imageDataUrl);
}

function dataURLtoFile(dataUrl: string, fileName: string = "File"): File {
  var arr = dataUrl.split(","),
    mime = arr[0].match(/:(.*?);/)?.[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
}

export function canShare(payload: ShareContent) {
  if (!isWebShareApiSupported()) return false;
  try {
    return navigator?.canShare(payload);
  } catch (_) {
    return false;
  }
}

export function canShareImage(): boolean {
  return canShare({ files: [getDummyImageFile()] });
}
