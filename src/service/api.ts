/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE_URL || '/api'),
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('authToken')
    if (token) headers.set('Authorization', `Bearer ${token}`)
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

export const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    const refreshUrl = import.meta.env.VITE_API_REFRESH_URL as string | undefined
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshUrl && refreshToken) {
      const refresh = await rawBaseQuery(
        { url: refreshUrl, method: 'POST', body: { refreshToken } },
        api,
        extraOptions,
      )
      const newToken = (refresh as any).data?.token as string | undefined
      if (newToken) {
        localStorage.setItem('authToken', newToken)
        result = await rawBaseQuery(args, api, extraOptions)
      } else {
        localStorage.removeItem('authToken')
      }
    }
  }
  return result
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Auth', 'Users', 'Events', 'Tickets'],
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
