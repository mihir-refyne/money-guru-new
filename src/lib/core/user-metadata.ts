import {
  getFromSessionStorage,
  setInSessionStorage,
} from "../storage/browserstorage";

export interface UserMetadata {
  id?: string;
  name?: string;
  status?: string;
  referralLink?: string;
  idToken?: string;
  appPlatformName?: string;
}

const USER_METADATA_STORAGE_KEY = "__UserMetadata";

export function hasUserMetadata(): boolean {
  return !!getFromSessionStorage(USER_METADATA_STORAGE_KEY);
}

export function getUserMetadata(): UserMetadata | null {
  try {
    const userMetadataAsString = getFromSessionStorage(
      USER_METADATA_STORAGE_KEY
    );
    if (!userMetadataAsString) return null;
    return JSON.parse(userMetadataAsString) as UserMetadata;
  } catch (_) {
    return null;
  }
}

export function setUserMetadata(payload: UserMetadata) {
  try {
    setInSessionStorage(USER_METADATA_STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (_) {
    return false;
  }
}

export function getValueFromMetadata(
  key: keyof UserMetadata
): UserMetadata[keyof UserMetadata] {
  const userMetadata = getUserMetadata();
  if (!userMetadata) return;
  return userMetadata[key];
}
