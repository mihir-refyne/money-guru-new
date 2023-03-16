import { fetcher } from "../fetcher";
import {
  getValueFromMetadata,
  setUserMetadata,
  UserMetadata,
} from "./user-metadata";

const CORE_SERVER_BASE_URL = process.env.NEXT_PUBLIC_CORE_SERVER_BASE_URL;

interface User {
  _id: string;
  name?: {
    data?: string;
  };
  status: string;
}

interface ReferralDetails {
  referralDetails: {
    link: string;
  };
}

interface Worker {
  _id: string;
  employerId: string;
}

interface WorkerDetails {
  type: "employee" | "contractor";
  entity: Worker;
}

async function getUser(idToken?: string): Promise<User | null> {
  if (!idToken) idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;
  const userResponse = await fetcher<User>(`${CORE_SERVER_BASE_URL}/user`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return userResponse.data;
}

async function getReferralDetails(
  idToken?: string
): Promise<ReferralDetails | null> {
  if (!idToken) idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;
  const response = await fetcher<ReferralDetails>(
    `${CORE_SERVER_BASE_URL}/user/referral/referral-details`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data;
}

export async function getWorkerDetails(
  idToken?: string
): Promise<WorkerDetails | null> {
  if (!idToken) idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;
  const response = await fetcher<WorkerDetails>(
    `${CORE_SERVER_BASE_URL}/user/worker-info`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data;
}

export async function getAndSetUserMetadataFromServer(
  idToken: string,
  extra?: UserMetadata
): Promise<UserMetadata> {
  const [user, referralDetails, workerDetails] = await Promise.all([
    getUser(idToken),
    getReferralDetails(idToken),
    getWorkerDetails(idToken),
  ]);
  const metadata: UserMetadata = {
    id: user?._id,
    name: user?.name?.data,
    status: user?.status,
    employerId: workerDetails?.entity?.employerId,
    referralLink: referralDetails?.referralDetails.link,
    idToken,
    ...extra,
  };
  setUserMetadata(metadata);
  return metadata;
}
