/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE_URL || '/api'),
  credentials: 'include',
  prepareHeaders: (headers, { getState: _getState }) => {
    const token = localStorage.getItem('authToken')
    if (token) headers.set('Authorization', `Bearer ${token}`)
    // Only set Content-Type for non-FormData requests
    if (!headers.has('content-type')) {
      headers.set('Content-Type', 'application/json')
    }
    return headers
  },
})

// The refresh token itself is an httpOnly cookie set by the backend on login
// (via any method — password or Firebase/Google both go through the same
// session), never exposed to JS. `credentials: 'include'` on rawBaseQuery is
// what actually sends it — the endpoint takes no body, matching the backend's
// own `curl -X POST /auth/refresh` example.
const REFRESH_PATH = '/auth/refresh'

const clearSession = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('user')
  localStorage.removeItem('email_verified')
}

// Multiple requests can 401 at nearly the same time (e.g. several widgets
// fetching on mount after the access token has expired); share a single
// in-flight refresh across all of them instead of firing one per request.
let refreshPromise: Promise<boolean> | null = null

const refreshSession = (api: Parameters<BaseQueryFn>[1], extraOptions: Parameters<BaseQueryFn>[2]) => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const refreshResult = await rawBaseQuery({ url: REFRESH_PATH, method: 'POST' }, api, extraOptions)
        if (refreshResult.error) return false
        const data = refreshResult.data as any
        if (data?.success === false) return false
        // The response body carries the user's profile, not a bearer token — the
        // renewed session lives entirely in the Set-Cookie header on this same
        // response (handled by the browser via `credentials: 'include'`). Still
        // pick up a token here if the backend ever adds one, and refresh the
        // cached user profile since this response has the latest copy.
        const newToken = data?.data?.token || data?.data?.access_token || data?.token || data?.access_token
        if (newToken) localStorage.setItem('authToken', String(newToken))
        if (data?.data) localStorage.setItem('user', JSON.stringify(data.data))
        return true
      } catch {
        return false
      } finally {
        refreshPromise = null
      }
    })()
  }
  return refreshPromise
}

export const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    const refreshed = await refreshSession(api, extraOptions)
    if (refreshed) {
      result = await rawBaseQuery(args, api, extraOptions)
    } else {
      clearSession()
    }
  }
  return result
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Auth', 'Users', 'Events', 'Tickets', 'Templates', 'Comments', 'Gallery'],
  endpoints: () => ({}),
})

// Note: endpoint injections are defined in feature folders under src/RTK/** to keep api.ts focused on base config.

export type ApiRequestOptions = {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  params?: Record<string, string | number | boolean | undefined>
  body?: any
  headers?: HeadersInit
}

const buildUrl = (base: string, path: string, params?: ApiRequestOptions['params']) => {
  const url = new URL(path, base)
  if (params) {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) qs.append(k, String(v))
    })
    const q = qs.toString()
    if (q) url.search = q
  }
  return url.toString()
}

export async function apiRequest<T = any>({ url, method = 'GET', params, body, headers }: ApiRequestOptions): Promise<T> {
  const base = import.meta.env.VITE_API_BASE_URL || '/api'
  const token = localStorage.getItem('authToken')
  const finalUrl = buildUrl(base, url, params)
  const res = await fetch(finalUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed with status ${res.status}`)
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return (await res.json()) as T
  return (await res.text()) as unknown as T
}
