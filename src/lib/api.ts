import { supabase } from './supabase'

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:4000'

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession()
  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...(opts.headers || {}),
    },
  })
  if (res.status === 204) return undefined as T
  const text = await res.text()
  const body = text ? JSON.parse(text) : null
  if (!res.ok) throw new Error(body?.error || res.statusText)
  return body as T
}

export const api = {
  get:    <T = any>(p: string) => request<T>(p),
  post:   <T = any>(p: string, b?: unknown) => request<T>(p, { method: 'POST', body: JSON.stringify(b ?? {}) }),
  put:    <T = any>(p: string, b?: unknown) => request<T>(p, { method: 'PUT',  body: JSON.stringify(b ?? {}) }),
  delete: <T = any>(p: string) => request<T>(p, { method: 'DELETE' }),
}
