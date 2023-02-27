export function isStringAndNotEmpty(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (!value) return false;
  return true;
}
