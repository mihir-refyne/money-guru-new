import { useShare } from "@/hooks/useShare";
import { getValueFromMetadata } from "@/lib/core/user-metadata";
import { DigitalProductFulfillmentDetails } from "@/lib/order";
import { isIOS } from "@/lib/utils";
import { isCurrentlyOnRefyneWebview } from "@/lib/webview";
import { Copy } from "phosphor-react";

interface VoucherCardProps {
  details: DigitalProductFulfillmentDetails;
}

interface FieldRowProps {
  showCopyBtn: boolean;
  label: string;
  value?: string | Date;
  onCopy?: (copyText: string) => void;
}

function formatDate(date?: Date | string): string {
  if (!date) return "";
  if (date instanceof Date) {
    return date.toLocaleDateString();
  }
  return date;
}

export default function VoucherCard({ details }: VoucherCardProps) {
  const appPlatformName = getValueFromMetadata("appPlatformName");
  const { shareOrClipboardCopy } = useShare({
    isNativePlatformShareSupported:
      isCurrentlyOnRefyneWebview(appPlatformName) && !isIOS(),
  });

  function handleCopyToClipBoard(copyText: string) {
    shareOrClipboardCopy({ imageUrls: [], text: copyText });
  }

  return (
    <>
      {details.couponCode && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "var(--clr-background-enabled)",
            border: "1px solid #F0F0F0",
            borderRadius: "8px",
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          <FieldRow
            label="Voucher"
            value={details.couponCode ?? ""}
            showCopyBtn
            onCopy={handleCopyToClipBoard}
          />
        </div>
      )}
      {details.expiryDate && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "var(--clr-background-enabled)",
            border: "1px solid #F0F0F0",
          }}
        >
          <FieldRow
            showCopyBtn={false}
            label="Expiry"
            value={details.expiryDate}
          />
        </div>
      )}
      {details.redeemInstruction?.couponPlacementUrl && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "var(--clr-background-enabled)",
            border: "1px solid #F0F0F0",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontWeight: "400",
              marginBottom: "8px",
              color: "var(--clr-text-secondary)",
            }}
          >
            {details.couponCode
              ? "Link to Apply Voucher"
              : "Link to Redeem Voucher"}
          </p>
          <button
            onClick={() =>
              window.open(details.redeemInstruction?.couponPlacementUrl)
            }
            className="btn btn-block btn-primary"
          >
            Redeem
          </button>
        </div>
      )}
    </>
  );
}

function FieldRow({ showCopyBtn, label, value, onCopy }: FieldRowProps) {
  return (
    <div>
      <h5
        style={{
          fontSize: "14px",
          fontWeight: "400",
          color: "var(--clr-text-secondary)",
        }}
      >
        {label}
      </h5>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "4px",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "var(--clr-text-primary)",
          }}
        >
          {formatDate(value)}
        </p>
        {showCopyBtn && (
          <button
            onClick={() => onCopy?.(formatDate(value))}
            className="btn"
            style={{ display: "flex", alignItems: "center" }}
          >
            <span
              style={{ color: "#0057B7", fontSize: "14px", fontWeight: "600" }}
              className="mr-2"
            >
              Copy
            </span>
            <Copy width={20} height={20} color="#0057B7" />
          </button>
        )}
      </div>
    </div>
  );
}
