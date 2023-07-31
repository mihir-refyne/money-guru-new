import Script from "next/script";

const TARGET_FONT_SIZE_IN_PX = 10;
const OFFSET = 0.5;

export default function ResetFontBoostingScript() {
  return (
    <Script id="reset_font_boosting" type="text/javascript">
      {`(function () {
        const htmlRootElem = document.querySelector("html");
        if (!htmlRootElem) return;
        const compStyles = window.getComputedStyle(htmlRootElem);
        const fontSizeInPxString = compStyles.getPropertyValue("font-size");
        const currentRootFontSizeInPx = Number(fontSizeInPxString.slice(0, -2));
        if (Number.isNaN(currentRootFontSizeInPx)) return;
        const targetFontSize = ${TARGET_FONT_SIZE_IN_PX};
        const offset = ${OFFSET};
        if (
            currentRootFontSizeInPx <= targetFontSize + offset &&
            currentRootFontSizeInPx >= targetFontSize - offset
        )
            return;
        const percentageDiff =
            (targetFontSize - currentRootFontSizeInPx) / currentRootFontSizeInPx;
        const normalizedRootFontSize = (
            targetFontSize +
            targetFontSize * percentageDiff
        ).toFixed(2);
        console.log("Setting Root HTML Font size as ", normalizedRootFontSize);
        htmlRootElem.style.fontSize = normalizedRootFontSize + "px";
      })()`}
    </Script>
  );
}
