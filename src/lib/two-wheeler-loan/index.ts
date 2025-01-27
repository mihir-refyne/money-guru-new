import { getValueFromMetadata } from "../core/user-metadata";
import { CORE_SERVER_BASE_URL } from "@/constants";
import { fetcher } from "../fetcher";

export enum VehicleType {
  TWO_WHEELER = "TWO_WHEELER",
}

export enum EngineType {
  EV = "EV",
  ICE = "ICE",
}

export enum LoanStatus {
  INITIATED = "INITIATED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

interface VehicleDetails {
  vehicleType: VehicleType;
  engineType: EngineType;
}

interface ApplicationDetails {
  amount: number;
  tenure: number;
}

interface Address {
  pincode: number;
}

export interface ApprovalDetails {
  amount: number;
  approvedAt: string;
  interestRate: number;
}

export interface VehicleLoan {
  id: string;
  userId: string;
  vehicleDetails: VehicleDetails;
  applicationDetails: ApplicationDetails;
  address: Address;
  status: LoanStatus;
  applicationApprovalDetails?: ApprovalDetails;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceabilityResponse {
  serviceable: boolean;
  pincodeMetadata: {
    pincode: number;
    city: string;
    district: string;
    state: string;
    country: string;
  };
}

export interface VehicleLoanApplicationInput {
  vehicleType: string;
  engineType: EngineType;
  applicationAmount: number;
  onRoadPrice: number;
  tenure: number;
  pincode: string;
}

export async function fetchAllLoans(): Promise<VehicleLoan[] | null> {
  const idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;

  const userLoansResponse = await fetcher<VehicleLoan[] | null>(
    `${CORE_SERVER_BASE_URL}/vehicle-loan`,
    {
      method: "GET",
      query: {
        limit: "1",
      },
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );

  return userLoansResponse.data;
}

export async function fetchPincodeServiceability({
  pincode,
}: {
  pincode: string;
}): Promise<ServiceabilityResponse | null> {
  if (pincode.length !== 6) return null;

  const idToken = getValueFromMetadata("idToken");

  if (!idToken) return null;

  const pincodeServiceabilityResponse =
    await fetcher<ServiceabilityResponse | null>(
      `${CORE_SERVER_BASE_URL}/vehicle-loan/serviceability?pincode=${pincode}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

  return pincodeServiceabilityResponse.data;
}

export async function applyForLoan(
  applicationDetail: VehicleLoanApplicationInput
): Promise<void> {
  const idToken = getValueFromMetadata("idToken");
  if (!idToken) return;

  await fetcher<VehicleLoan>(`${CORE_SERVER_BASE_URL}/vehicle-loan`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    payload: {
      ...applicationDetail,
    },
  });
}
