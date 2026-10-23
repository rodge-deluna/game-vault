const AUTH_STORAGE_KEY = 'gamevault_auth'

// Error thrown for any non-2xx response. `message` comes from the API's
// { message } error body, so it can be shown to the user directly.
export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function getStoredAuth(): { token: string; user: unknown } | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setStoredAuth(auth: { token: string; user: unknown } | null) {
  try {
    if (auth) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
    else localStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {
    // Storage can be unavailable (e.g. private mode); the session just won't persist.
  }
}

// Wrapper around fetch that:
// - prefixes /api so requests go through the Vite proxy
// - sends the JWT when the user is logged in
// - throws ApiError with the server's message on failure
export async function apiFetch<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const headers: Record<string, string> = {}
  const token = getStoredAuth()?.token

  if (token) headers.Authorization = `Bearer ${token}`
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'

  const res = await fetch(`/api${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new ApiError(res.status, body?.message ?? `Request failed (${res.status})`)
  }

  // 204 No Content (e.g. deletes) has no body to parse
  if (res.status === 204) return undefined as T

  return res.json() as Promise<T>
}
