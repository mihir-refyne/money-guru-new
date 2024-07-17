import { CORE_SERVER_BASE_URL } from "@/constants";
import { fetcher } from "../fetcher";
import { getValueFromMetadata } from "./user-metadata";

const BASE_URL = `${CORE_SERVER_BASE_URL}/voucher-marketplace/v1/vouchers`;

interface VoucherAvailability {
  available: boolean;
}

type VoucherAllotmentStatus = "INITIATED" | "ALLOCATED";

interface VoucherAllotment {
  _id: string;
  user_id: string;
  voucher_name: string;
  status: VoucherAllotmentStatus;
  voucher_code?: string;
  payment_details?: {
    amount_paid: number;
    paid_at: string;
    link_id: string;
    payment_gateway: string;
    pg_link_id: string;
  };
  created_at: string;
  updated_at: string;
}

export type VoucherUIState =
  | {
      status: "UNAUTHENTICATED";
    }
  | {
      status: "VOUCHER_AVAILABLE";
    }
  | {
      status: "VOUCHER_UNAVAILABLE";
    }
  | {
      status: "VOUCHER_ALLOCATED";
      allotmentDetails: VoucherAllotment;
    };

export interface VoucherPurchaseInitiateResponse {
  payment_link_id: string;
  amount: number;
  payment_link: string;
  expires_at: string;
  allotment?: VoucherAllotment;
}

async function getVoucherAvailability(
  name: string
): Promise<VoucherAvailability> {
  const response = await fetcher<{ data: VoucherAvailability }>(
    `${BASE_URL}/availability`,
    {
      method: "GET",
      query: {
        name,
      },
    }
  );
  return response.data.data;
}

async function getVoucherAllotment(
  name: string
): Promise<VoucherAllotment | null> {
  const idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;
  const response = await fetcher<{ data: VoucherAllotment }>(
    `${BASE_URL}/allotment`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      query: {
        name,
      },
    }
  );
  return response.data.data;
}

export async function getVoucherUIState(
  name?: string
): Promise<VoucherUIState> {
  if (!name)
    return {
      status: "VOUCHER_UNAVAILABLE",
    };
  const idToken = getValueFromMetadata("idToken");
  if (!idToken)
    return {
      status: "UNAUTHENTICATED",
    };
  const allotment = await getVoucherAllotment(name);
  if (allotment)
    return {
      status: "VOUCHER_ALLOCATED",
      allotmentDetails: allotment,
    };
  const availability = await getVoucherAvailability(name);
  if (availability.available)
    return {
      status: "VOUCHER_AVAILABLE",
    };
  return {
    status: "VOUCHER_UNAVAILABLE",
  };
}

export async function initiateVoucherPurchase(
  name: string,
  payVia: "EWA" | "PG" = "PG"
): Promise<VoucherPurchaseInitiateResponse | null> {
  const idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;
  const response = await fetcher<{ data: VoucherPurchaseInitiateResponse }>(
    `${BASE_URL}/buy`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      payload: {
        name,
        pay_via: payVia
      },
    }
  );
  return response.data.data;
}
