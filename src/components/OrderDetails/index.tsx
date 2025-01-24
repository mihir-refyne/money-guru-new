import {
  DeliveryDetails,
  DigitalProductFulfillmentDetails,
  GetOrderItemInfo,
  OrderTimeline,
  Vendor,
} from "@/lib/order";
import { formatToInr } from "@/lib/utils";
import Image from "next/image";
import { useMemo } from "react";
import Accordions from "../Accordion";
import Card from "../Card";
import { OrderTimelineComp } from "../OrderTimeline";
import VoucherCard from "../VoucherCard";
import styles from "./styles.module.css";

interface OrderDetailsProps {
  orderDetail: GetOrderItemInfo | null;
}

interface ItemDetailsProps {
  name: string;
  vendor: Vendor;
  imageUrl?: string;
  price: number;
  orderTimeline: OrderTimeline[];
}

interface DeliveryToProps {
  deliveryDetails: DeliveryDetails;
}

interface VoucherDetailsProps {
  voucherDetails?: DigitalProductFulfillmentDetails;
}

export default function OrderDetails({ orderDetail }: OrderDetailsProps) {
  const ACCORDIONS_ITEMS = useMemo(
    () => [
      {
        id: "section1",
        headerText: "How to redeem",
        content: (
          <div className={styles.commonContainerStyle}>
            <ul className={styles.list}>
              {
                // Split the howToUse string by newline characters and render each line as a list item
                orderDetail?.digitalProductFulfillmentDetails?.redeemInstruction?.howToUse
                  ?.split("\n")
                  .map((text, index) => (
                    <li key={index} className={styles.commonListItemStyle}>
                      {text.trim()}
                    </li>
                  ))
              }
            </ul>
          </div>
        ),
      },
    ],
    [orderDetail]
  );

  if (!orderDetail) return null;

  return (
    <div className={styles.container}>
      <Card backgroundColor="var(--clr-background-enabled)">
        <ItemDetails
          name={orderDetail.name}
          vendor={orderDetail?.vendor ?? Vendor.FLEEK}
          imageUrl={orderDetail.imageUrl}
          price={orderDetail.price}
          orderTimeline={orderDetail.orderTimeline}
        />
        <hr className={styles.divider} />
        <OrderTimelineComp
          timeLine={orderDetail.orderTimeline}
        />
      </Card>

      <div className={styles.section}>
        <h5 className={styles.sectionHeader}>Delivery to</h5>
        <Card backgroundColor="var(--clr-background-enabled)">
          <DeliveryTo deliveryDetails={orderDetail.deliveryDetails} />
        </Card>
      </div>

      {/* Voucher Details Section */}
      {orderDetail.digitalProductFulfillmentDetails && (
        <div className={styles.section}>
          <h5 className={styles.sectionHeader}>Voucher details</h5>
          <VoucherDetails
            voucherDetails={orderDetail.digitalProductFulfillmentDetails}
          />
        </div>
      )}

      {/* Voucher Details Accordions */}
      {orderDetail.digitalProductFulfillmentDetails &&
        orderDetail.digitalProductFulfillmentDetails.redeemInstruction && (
          <div className={styles.accordion}>
            <Accordions items={ACCORDIONS_ITEMS} />
          </div>
        )}

      {/* Track Order Section */}
      {orderDetail.trackingDetails && (
        <div>
          <h5
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--clr-text-primary)",
              margin: "16px 0",
            }}
          >
            Track Order
          </h5>
          <div
            style={{
              border: "1px solid #F0F0F0",
              borderRadius: "8px",
              padding: "16px",
              borderBottom: "1px solid #F0F0F0",
              backgroundColor: "var(--clr-background-enabled)",
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <h5
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "var(--clr-text-secondary)",
                }}
              >
                Your order will be delivered by{" "}
                <b>{orderDetail.trackingDetails.shippingVendor}</b>
              </h5>
              {orderDetail.trackingDetails.trackingLink && (
                <button
                  style={{ width: "40%" }}
                  className="btn btn-block btn-primary"
                  onClick={() => {
                    const trackingLink =
                      orderDetail.trackingDetails?.trackingLink;
                    if (trackingLink) {
                      window.location.href = trackingLink;
                    }
                  }}
                >
                  Track Order
                </button>
              )}
            </div>
          </div>
          <div
            style={{
              border: "1px solid #F0F0F0",
              borderRadius: "8px",
              padding: "16px 8px",
              backgroundColor: "var(--clr-background-enabled)",
              borderTopRightRadius: 0,
              borderTopLeftRadius: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <h5
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "var(--clr-text-secondary)",
                }}
              >
                Tracking ID
              </h5>
              <p>{orderDetail.trackingDetails.trackingId}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ItemDetails({ name, price, vendor, imageUrl }: ItemDetailsProps) {
  const DEFAULT_IMAGE_URL =
    "https://assets.refyne.co.in/assets/images/cart.png";
  const src = imageUrl ? imageUrl : DEFAULT_IMAGE_URL;

  return (
    <div className={styles.itemDetails}>
      <div className={styles.imageWrapper}>
        <Image
          src={src}
          width={90}
          height={80}
          style={{ objectFit: "contain" }}
          alt="order-item-img"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_IMAGE_URL; // Fallback to default image
          }}
        />
      </div>
      <div>
        <h5 className={styles.itemName}>{name}</h5>
        <div className={styles.vendorDetails}>
          <p className={styles.vendorLabel}>Vendor</p>
          <p className={styles.vendorValue}>{vendor}</p>
        </div>
        <h5 className={styles.itemPrice}>{formatToInr(price)}</h5>
      </div>
    </div>
  );
}

function getVoucherDetailsMessage(phoneNumber?: string, email?: string) {
  if (phoneNumber && email) {
    return `Voucher details will be sent to you via email (${email}) and WhatsApp/SMS (${phoneNumber})`;
  }
  if (phoneNumber) {
    return `Voucher details will be sent to you via WhatsApp/SMS (${phoneNumber})`;
  }
  if (email) {
    return `Voucher details will be sent to you via email (${email})`;
  }
  return "No contact details available to send voucher details";
}

function DeliveryTo({ deliveryDetails }: DeliveryToProps) {
  const phoneNumberForVirtualAddress =
    deliveryDetails.virtualAddress?.phoneNumber;
  const emailForVirtualAddress = deliveryDetails.virtualAddress?.email;
  const physicalAddressDetails = deliveryDetails.physicalAddress;
  const shippingAddress = `${physicalAddressDetails?.name}, ${physicalAddressDetails?.phone}, ${physicalAddressDetails?.address1}, ${physicalAddressDetails?.city}, ${physicalAddressDetails?.pinCode}`;

  const deliveryAddress = deliveryDetails.physicalAddress
    ? shippingAddress
    : getVoucherDetailsMessage(
        phoneNumberForVirtualAddress,
        emailForVirtualAddress
      );

  return <p className={styles.deliveryDetails}>{deliveryAddress}</p>;
}

function VoucherDetails({ voucherDetails }: VoucherDetailsProps) {
  if (!voucherDetails)
    return (
      <p className={styles.voucherPlaceholder}>
        Voucher details will be available here shortly
      </p>
    );

  return <VoucherCard details={voucherDetails} />;
}
