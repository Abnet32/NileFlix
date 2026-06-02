const RELATIVE_PATH_PATTERN = /^\/[\w\-./~%]*([?#].*)?$/;

export function sanitizeCallbackUrl(
  callbackUrl: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (!callbackUrl) return fallback;

  // Only allow same-origin relative paths to prevent open redirects.
  if (!RELATIVE_PATH_PATTERN.test(callbackUrl)) return fallback;
  if (callbackUrl.startsWith("//")) return fallback;

  return callbackUrl;
}
