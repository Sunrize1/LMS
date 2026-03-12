const API_ORIGIN =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/api\/?$/, '') ||
  'http://localhost:8080'

/**
 * Converts a file URL to an absolute URL.
 * If the URL is already absolute (http/https), returns it as-is.
 * If relative (e.g. /api/v1/files/foo.pdf), prepends the backend origin.
 */
export function toAbsoluteFileUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${API_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`
}
