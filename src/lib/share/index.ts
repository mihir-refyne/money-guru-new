import { dispatchDataToNativePlatform } from "../webview";

interface ShareContent {
  files?: File[];
  text?: string;
  title?: string;
  url?: string;
}

export async function getFileByRemoteImageUrl(url: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  // TODO: testing with the file name
  const file = new File([blob], Date.now().toString(), {
    type: blob.type,
  });
  return file;
}

export async function getDataUrlByRemoteImageUrl(
  url: string
): Promise<string | null> {
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
  // TODO: Remove logs from all over
  console.log({ context: "share Invoked" });
  if (!canShare(payload)) return false;
  console.log({ context: "share canShare returned true" });
  try {
    await navigator?.share(payload);
    console.log({ context: "share success" });
    return true;
  } catch (error) {
    console.log({ context: "share error", error });
    return false;
  }
}

export async function shareWithImageUrls(
  payload: Omit<ShareContent, "files"> & { imageUrls: string[] }
) {
  const { imageUrls, ...rest } = payload;
  const files = await Promise.all(imageUrls.map(getFileByRemoteImageUrl));
  // TODO: Remove logs
  console.log({ context: "shareWithImageUrls", files });
  return share({ files, ...rest });
}

export async function shareToNativePlatformWithImageUrls(
  payload: Omit<ShareContent, "files"> & { imageUrls?: string[] }
) {
  const { imageUrls, ...rest } = payload;
  if (!imageUrls) {
    return dispatchDataToNativePlatform({
      type: "SHARE",
      body: rest,
    });
  }
  const imageDataUrls = await Promise.all(
    imageUrls.map(getDataUrlByRemoteImageUrl)
  ).catch((_) => null);
  const filteredImageDataUrls = imageDataUrls?.filter(Boolean) ?? null;
  const body = { imageDataUrls: filteredImageDataUrls, ...rest };
  return dispatchDataToNativePlatform({
    type: "SHARE",
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
  console.log({ context: "canShare Invoked" });
  if (!isWebShareApiSupported()) return false;
  console.log({ context: "WebShare Supported" });
  try {
    return navigator?.canShare(payload);
  } catch (_) {
    console.log({ context: "canShare Error", error: _ });
    return false;
  }
}

export function canShareImage(): boolean {
  return canShare({ files: [getDummyImageFile()] });
}
