export interface ReleaseConfig {
  fieldName?: string;
  includes?: boolean;
  values?: Array<string>;
}

// TODO(mock-data): remove once local dev has real employerId/workerId/userId
// context to test against, or real backend data is wired up for dev. This
// bypasses all release-config gating in local dev so every dashboard card
// (e.g. PF tracker) renders for UI/mock-data review.
const FORCE_ENABLE_ALL_IN_DEV = process.env.NODE_ENV === "development";

export function checkIfFeatureEnabledByReleaseConfig(
  config: ReleaseConfig = {},
  context: Record<string, unknown> = {}
): boolean {
  if (FORCE_ENABLE_ALL_IN_DEV) return true;
  const { fieldName, includes = true, values } = config;
  if (!fieldName || !values) return true;
  const fieldValueFromContext = context[fieldName];
  if (!fieldValueFromContext) return false;
  const isFieldValueInSpecifiedConfig = values.includes(
    fieldValueFromContext as string
  );
  if (includes) return isFieldValueInSpecifiedConfig;
  return !isFieldValueInSpecifiedConfig;
}
