export interface ReleaseConfig {
  fieldName?: string;
  includes?: boolean;
  values?: Array<string>;
}

export function checkIfFeatureEnabledByReleaseConfig(
  config: ReleaseConfig = {},
  context: Record<string, unknown> = {}
): boolean {
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
