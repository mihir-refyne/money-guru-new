import { CORE_SERVER_BASE_URL } from "@/constants";
import { fetcher } from "../fetcher";
import { getValueFromMetadata } from "./user-metadata";
import { UiMetadata } from "./ui-metadata";

export interface UserVirtualRewardSummary {
  rewardId: string;
  wonCount: number;
}

export interface UserVirtualRewardSummaryResponse {
  rewards: UserVirtualRewardSummary[];
}

export interface UserRewardsSummary {
  uiMetadata: UiMetadata;
  rewardId: string;
  actionMetadata: {
    perDayLimit?: number;
    completedCountToday?: number;
  };
}

export interface UserRewardsSummaryResponse {
  rewards: UserRewardsSummary[];
}

export interface FestiveEventConfig {
  startDate: string;
  endDate: string;
  rewardId: string;
  uiMetadata: UiMetadata;
}

export interface UserFestiveEventsResponse {
  upcomingEvents: FestiveEventConfig[];
  ongoingEvent?: FestiveEventConfig;
  pastEvents: FestiveEventConfig[];
}

export interface FestiveEventClaimResponse {
  wonRewardSnapshot: {
    _id: string;
  };
}

export async function getUserVirtualRewardSummary(
  idToken?: string
): Promise<UserVirtualRewardSummaryResponse | null> {
  if (!idToken) idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;
  const response = await fetcher<UserVirtualRewardSummaryResponse>(
    `${CORE_SERVER_BASE_URL}/rewards/user/virtual-rewards/summary`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data;
}

export async function generateVirtualRewardGiftLink(
  virtualRewardId: string
): Promise<{
  giftingLink: string;
} | null> {
  const idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;
  const response = await fetcher<{ giftingLink: string }>(
    `${CORE_SERVER_BASE_URL}/rewards/user/gift/link?virtualRewardId=${virtualRewardId}`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data;
}

export async function giftVirtualReward(
  requesterUserId: string,
  virtualRewardId: string
): Promise<void | null> {
  const idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;
  await fetcher(`${CORE_SERVER_BASE_URL}/rewards/user/gift/requester`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    payload: {
      requesterUserId,
      virtualRewardId,
    },
  });
}

export async function claimVirtualRewardGift(
  uniqueIdentifier: string
): Promise<{ wonRewardId: string } | null> {
  const idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;
  const response = await fetcher<{ wonRewardId: string }>(
    `${CORE_SERVER_BASE_URL}/rewards/user/gift/claim`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      payload: {
        uniqueIdentifier,
      },
    }
  );
  return response.data;
}

export async function generateVirtualRewardRequestLink(): Promise<{
  requestingLink: string;
} | null> {
  const idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;
  const response = await fetcher<{ requestingLink: string }>(
    `${CORE_SERVER_BASE_URL}/rewards/user/request/link`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data;
}

export async function getUserRewardsSummary(): Promise<UserRewardsSummaryResponse | null> {
  const idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;
  const response = await fetcher<UserRewardsSummaryResponse>(
    `${CORE_SERVER_BASE_URL}/rewards/user/action-summary`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data;
}

export async function getFestiveEvents(): Promise<UserFestiveEventsResponse | null> {
  const idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;
  const response = await fetcher<UserFestiveEventsResponse>(
    `${CORE_SERVER_BASE_URL}/rewards/user/events`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data;
}

export async function claimFestiveEvent(
  rewardId: string
): Promise<FestiveEventClaimResponse | null> {
  const idToken = getValueFromMetadata("idToken");
  if (!idToken) return null;
  const response = await fetcher<FestiveEventClaimResponse>(
    `${CORE_SERVER_BASE_URL}/rewards/user/event/claim`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      payload: {
        rewardId,
      },
    }
  );
  return response.data;
}
