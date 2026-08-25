const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://barber-api.admorandom.workers.dev'

type User = {
  id: string
  name: string
  email: string | null
  phone: string | null
  role: 'barber' | 'customer'
  language: 'en' | 'fr' | 'ar-MA'
}

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('barber:auth:token') : null
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_URL}${path}`, { ...opts, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((data as any).error || `Request failed ${res.status}`)
  return data as T
}

export async function apiRegister(name: string, email: string, phone: string, password: string): Promise<{ user: User; token: string }> {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, phone, password }),
  })
}

export async function apiLogin(email: string, password: string): Promise<{ user: User; token: string }> {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function apiSetup(payload: {
  slug: string
  displayName: string
  bio?: string
  phone: string
  whatsapp?: string
  instagram?: string
  location?: string
  avatar?: string | null
  services: Array<{ id?: string; name: string; price: string; duration: number; active?: boolean }>
}): Promise<{ profile: any; services: any[]; url: string }> {
  return request('/api/barber/setup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function apiGetBarber(slug: string): Promise<{ profile: any; services: any[] }> {
  return request(`/api/barber/${encodeURIComponent(slug)}`)
}

export async function apiListBarbers(): Promise<{ barbers: any[] }> {
  return request('/api/barbers')
}

export { API_URL }
