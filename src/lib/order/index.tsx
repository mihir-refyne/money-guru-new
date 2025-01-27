import { CORE_SERVER_BASE_URL } from "@/constants";
import { getValueFromMetadata } from "../core/user-metadata";
import { fetcher } from "../fetcher";

export type OrderStatus =
  | "PENDING"
  | "INITIATED"
  | "FULFILLED"
  | "SHIPPED"
  | "CANCELLED";

export interface GetOrderItemInfo {
  _id: string;
  orderId: string;
  imageUrl?: string;
  shopifyProductId: string;
  fulfillmentPartner: string;
  sku: string;
  fulfillmentStatus: string;
  eta?: Date;
  deliveredAt?: Date;
  digitalProductFulfillmentDetails?: DigitalProductFulfillmentDetails;
  name: string;
  price: number;
  cancelledAt?: Date;
  orderTimeline: OrderTimeline[];
  deliveryDetails: DeliveryDetails;
  trackingDetails?: {
    shippingVendor: string;
    trackingLink: string;
    trackingId: string;
  };
}

export interface DigitalProductFulfillmentDetails {
  couponCode?: string;
  couponLink?: string;
  expiryDate?: Date;
  redeemInstruction?: {
    howToUse: string;
    youtubeUrl: string;
    couponPlacementUrl?: string;
  };
}

export interface OrderTimeline {
  occurredAt: string | null;
  eta?: string;
  status: OrderStatus;
}

export interface DeliveryDetails {
  physicalAddress?: ShippingAddress;
  virtualAddress?: {
    phoneNumber?: string;
    email?: string;
  };
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  name: string;
  address1: string;
  address2?: string;
  phone: string;
  city: string;
  pinCode: string;
  province: string;
  provinceCode: string;
  country: string;
  countryCode: string;
}

export async function getOrderItemInfo(context: {
  userToken?: string | string[];
  shopifyOrderId?: string | string[];
  orderItemId?: string | string[];
}): Promise<GetOrderItemInfo | null> {
  let { userToken, shopifyOrderId, orderItemId } = context;
  if (!userToken) userToken = getValueFromMetadata("idToken");
  if (!userToken) return null;
  const response = await fetcher<GetOrderItemInfo>(
    `${CORE_SERVER_BASE_URL}/privilege-club/shopify/orders/${shopifyOrderId}/items/${orderItemId}`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );
  return response.data;
}
