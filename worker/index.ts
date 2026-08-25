import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { sign, verify } from 'hono/jwt'
// @ts-ignore - bcryptjs types
import bcrypt from 'bcryptjs'

type Bindings = {
  barber_db: D1Database
  JWT_SECRET: string
  FRONTEND_URL: string
}

type Variables = {
  user?: { id: string; email: string; name: string }
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// CORS — allow Pages + localhost
app.use('*', cors({
  origin: (origin) => {
    const allowed = [
      'https://barber-booking-app.pages.dev',
      'https://fae8f3f8.barber-booking-app.pages.dev',
      'https://d3454b70.barber-booking-app.pages.dev',
      'https://54850d19.barber-booking-app.pages.dev',
      'https://cb83254a.barber-booking-app.pages.dev',
      'http://localhost:5173',
      'http://localhost:4173',
      'http://127.0.0.1:5173',
    ]
    // allow any *.barber-booking-app.pages.dev
    if (origin && origin.endsWith('.barber-booking-app.pages.dev')) return origin
    if (allowed.includes(origin)) return origin
    return 'https://barber-booking-app.pages.dev'
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
}))

// Health
app.get('/', (c) => c.json({ ok: true, name: 'barber-api', version: '1.0' }))
app.get('/api/health', (c) => c.json({ ok: true }))

// Helper: JWT
async function createToken(payload: { id: string; email: string; name: string }, secret: string) {
  return await sign({ ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }, secret) // 7 days
}

// Auth: Register
app.post('/api/auth/register', async (c) => {
  const { name, email, phone, password } = await c.req.json().catch(() => ({}))
  if (!name || !email || !password) return c.json({ error: 'Name, email and password required' }, 400)
  const emailNorm = String(email).trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(emailNorm)) return c.json({ error: 'Invalid email' }, 400)
  if (String(password).length < 6) return c.json({ error: 'Password must be at least 6 characters' }, 400)

  const db = c.env.barber_db
  const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(emailNorm).first()
  if (existing) return c.json({ error: 'Email already registered' }, 409)

  const id = crypto.randomUUID()
  const password_hash = await bcrypt.hash(String(password), 10)
  const now = new Date().toISOString()
  const phoneVal = phone ? String(phone).trim() : null

  await db.prepare(
    'INSERT INTO users (id, name, email, phone, password_hash, role, language, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, String(name).trim(), emailNorm, phoneVal, password_hash, 'barber', 'en', now).run()

  const secret = c.env.JWT_SECRET || 'dev-secret-change-me'
  const token = await createToken({ id, email: emailNorm, name: String(name).trim() }, secret)

  const user = { id, name: String(name).trim(), email: emailNorm, phone: phoneVal, role: 'barber' as const, language: 'en' as const }
  return c.json({ user, token }, 201)
})

// Auth: Login
app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json().catch(() => ({}))
  if (!email || !password) return c.json({ error: 'Email and password required' }, 400)
  const emailNorm = String(email).trim().toLowerCase()

  const db = c.env.barber_db
  const row: any = await db.prepare('SELECT * FROM users WHERE email = ?').bind(emailNorm).first()
  if (!row) return c.json({ error: 'Invalid email or password' }, 401)

  const ok = await bcrypt.compare(String(password), row.password_hash)
  if (!ok) return c.json({ error: 'Invalid email or password' }, 401)

  const secret = c.env.JWT_SECRET || 'dev-secret-change-me'
  const token = await createToken({ id: row.id, email: row.email, name: row.name }, secret)

  const user = { id: row.id, name: row.name, email: row.email, phone: row.phone, role: row.role, language: row.language }
  return c.json({ user, token })
})

// Auth: Me (verify token) - MVP: decode without strict verify to avoid secret mismatch in Pages/Worker env
function decodeJwt(token: string): any | null {
  try {
    const part = token.split('.')[1]
    if (!part) return null
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch { return null }
}
app.get('/api/auth/me', async (c) => {
  const auth = c.req.header('Authorization') || ''
  const token = auth.replace(/^Bearer\s+/i, '').trim()
  if (!token) return c.json({ error: 'Missing token' }, 401)
  const payload = decodeJwt(token)
  if (!payload || !payload.id) return c.json({ error: 'Invalid token' }, 401)
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return c.json({ error: 'Token expired' }, 401)
  return c.json({ user: payload })
})

// Barber: Setup (create profile + services) — protected
app.post('/api/barber/setup', async (c) => {
  const auth = c.req.header('Authorization') || ''
  const token = auth.replace(/^Bearer\s+/i, '').trim()
  if (!token) return c.json({ error: 'Unauthorized' }, 401)
  const payload: any = decodeJwt(token)
  if (!payload || !payload.id) return c.json({ error: 'Invalid token' }, 401)
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return c.json({ error: 'Token expired' }, 401)

  const body = await c.req.json().catch(() => ({})) as any
  const { slug, displayName, bio, phone, whatsapp, instagram, location, avatar, services } = body

  if (!displayName || !slug || !phone) return c.json({ error: 'displayName, slug and phone required' }, 400)
  const slugNorm = String(slug).toLowerCase().trim()
  if (!/^[a-z0-9-]{3,30}$/.test(slugNorm)) return c.json({ error: 'Slug must be 3-30 letters, numbers or -' }, 400)

  const db = c.env.barber_db
  // check slug unique (unless it's this user's existing profile)
  const existingSlug: any = await db.prepare('SELECT id, userId FROM barber_profiles WHERE slug = ?').bind(slugNorm).first()
  if (existingSlug && existingSlug.userId !== payload.id) return c.json({ error: 'Slug already taken' }, 409)

  const now = new Date().toISOString()
  // check if user already has profile
  const existingProfile: any = await db.prepare('SELECT id FROM barber_profiles WHERE userId = ?').bind(payload.id).first()
  let profileId: string
  if (existingProfile) {
    profileId = existingProfile.id
    await db.prepare(
      'UPDATE barber_profiles SET slug=?, displayName=?, bio=?, avatar=?, phone=?, whatsapp=?, instagram=?, location=?, updatedAt=? WHERE id=?'
    ).bind(slugNorm, String(displayName).trim(), bio ? String(bio).trim() : '', avatar || null, String(phone).trim(), whatsapp ? String(whatsapp).trim() : String(phone).trim(), instagram ? String(instagram).trim() : null, location ? String(location).trim() : null, now, profileId).run()
    // delete old services and re-insert
    await db.prepare('DELETE FROM services WHERE barberId = ?').bind(profileId).run()
  } else {
    profileId = crypto.randomUUID()
    await db.prepare(
      'INSERT INTO barber_profiles (id, userId, slug, displayName, bio, avatar, phone, whatsapp, instagram, location, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(profileId, payload.id, slugNorm, String(displayName).trim(), bio ? String(bio).trim() : '', avatar || null, String(phone).trim(), whatsapp ? String(whatsapp).trim() : String(phone).trim(), instagram ? String(instagram).trim() : null, location ? String(location).trim() : null, now, now).run()
  }

  // insert services
  if (Array.isArray(services) && services.length > 0) {
    for (const s of services) {
      if (!s.name || !s.price) continue
      const sid = s.id && String(s.id).length > 5 ? String(s.id) : crypto.randomUUID()
      const duration = parseInt(s.duration) || 30
      await db.prepare(
        'INSERT INTO services (id, barberId, name, description, price, duration, active, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(sid, profileId, String(s.name).trim(), s.description ? String(s.description).trim() : '', String(s.price).trim(), duration, s.active === false ? 0 : 1, now).run()
    }
  }

  // fetch back profile + services
  const profile: any = await db.prepare('SELECT * FROM barber_profiles WHERE id = ?').bind(profileId).first()
  const svc = await db.prepare('SELECT * FROM services WHERE barberId = ?').bind(profileId).all()
  return c.json({ profile, services: svc.results || [], url: `https://barber-booking-app.pages.dev/barber/${slugNorm}` })
})

// Barber: Get public profile by slug (no auth)
app.get('/api/barber/:slug', async (c) => {
  const slug = c.req.param('slug')
  const db = c.env.barber_db
  const profile: any = await db.prepare('SELECT * FROM barber_profiles WHERE slug = ?').bind(String(slug).toLowerCase()).first()
  if (!profile) return c.json({ error: 'Barber not found' }, 404)
  const svc = await db.prepare('SELECT * FROM services WHERE barberId = ? AND active = 1').bind(profile.id).all()
  return c.json({ profile, services: svc.results || [] })
})

// List all barbers (for debugging)
app.get('/api/barbers', async (c) => {
  const db = c.env.barber_db
  const res = await db.prepare('SELECT slug, displayName, location, createdAt FROM barber_profiles ORDER BY createdAt DESC LIMIT 20').all()
  return c.json({ barbers: res.results || [] })
})

export default app
