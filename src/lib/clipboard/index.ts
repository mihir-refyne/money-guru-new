function isClipboardWebApiSupported(): boolean {
  return !!navigator?.clipboard;
}

export async function copyText(body: string): Promise<boolean> {
  try {
    if (!isClipboardWebApiSupported()) {
      throw new Error("Clipboard API not supported");
    }
    await navigator?.clipboard.writeText(body);
    return true;
  } catch (_) {
    return copyTextFallback(body);
  }
}

function copyTextFallback(body: string): boolean {
  var textArea = document.createElement("textarea");
  textArea.value = body;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  textArea.style.visibility = "hidden";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    return successful;
  } catch (_) {
    return false;
  } finally {
    document.body.removeChild(textArea);
  }
}
